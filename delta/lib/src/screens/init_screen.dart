import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../generated/digitaldelta.pbenum.dart';
import '../services/ble_mesh_service.dart';
import '../services/identity_service.dart';
import '../database/local_ledger.dart';
import '../widgets/peer_qr_section.dart';
import 'dashboard_screen.dart';

const _kPrivateKeyStorageKey = 'private_key';

const Duration _kStepGap = Duration(milliseconds: 420);

enum _OnboardingPhase { loading, permissions, authentication, form }

enum _StepVisual { pending, working, done, error }

class InitScreen extends StatefulWidget {
  const InitScreen({super.key});

  @override
  State<InitScreen> createState() => _InitScreenState();
}

class _InitScreenState extends State<InitScreen> {
  _OnboardingPhase _phase = _OnboardingPhase.loading;
  bool _permissionsBusy = false;
  String? _permissionError;

  _StepVisual _keyStep = _StepVisual.pending;
  _StepVisual _secondLoadingStep = _StepVisual.pending;
  _StepVisual _permStep = _StepVisual.pending;
  _StepVisual _btStep = _StepVisual.pending;

  final TextEditingController _displayNameController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  Role _selectedRole = Role.FIELD_VOLUNTEER;
  bool _submitting = false;
  bool _otpVerifying = false;

  /// `true` when a private key already exists — OTP unlocks app; no new keygen.
  bool _returningUser = false;

  /// Refreshes the dev OTP hint when the 30s window rolls over.
  final Stream<int> _otpDevHintTick = Stream<int>.periodic(
    const Duration(seconds: 1),
    (int count) => count,
  );

  String? _previewNodeId;
  String? _previewPublicKeyB64;
  bool _previewIdentityLoading = false;
  Object? _previewIdentityError;

  @override
  void initState() {
    super.initState();
    _routeByKey();
  }

  Future<void> _delayStep() => Future<void>.delayed(_kStepGap);

  Future<void> _routeByKey() async {
    setState(() {
      _keyStep = _StepVisual.working;
      _secondLoadingStep = _StepVisual.pending;
    });
    await _delayStep();

    const FlutterSecureStorage storage = FlutterSecureStorage();
    final String? key = await storage.read(key: _kPrivateKeyStorageKey);

    if (!mounted) return;

    setState(() => _keyStep = _StepVisual.done);
    await _delayStep();

    if (key != null && key.isNotEmpty) {
      setState(() => _secondLoadingStep = _StepVisual.working);
      await _delayStep();
      if (!mounted) return;
      setState(() {
        _secondLoadingStep = _StepVisual.done;
        _returningUser = true;
        _phase = _OnboardingPhase.authentication;
      });
      return;
    }

    setState(() {
      _secondLoadingStep = _StepVisual.working;
    });
    await _delayStep();
    if (!mounted) return;
    setState(() {
      _secondLoadingStep = _StepVisual.done;
      _phase = _OnboardingPhase.permissions;
      _permStep = _StepVisual.pending;
      _btStep = _StepVisual.pending;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _runPermissionFlow());
  }

  Future<void> _runPermissionFlow() async {
    setState(() {
      _permissionError = null;
      _permissionsBusy = true;
      _permStep = _StepVisual.working;
      _btStep = _StepVisual.pending;
    });
    await _delayStep();

    final BleMeshService mesh = BleMeshService.instance;
    final bool permsOk = await mesh.requestPermissions();
    if (!mounted) return;

    if (!permsOk) {
      setState(() {
        _permissionsBusy = false;
        _permStep = _StepVisual.error;
        _permissionError =
            'Bluetooth and location permissions are required. Tap Retry.';
      });
      return;
    }

    setState(() => _permStep = _StepVisual.done);
    await _delayStep();

    setState(() {
      _btStep = _StepVisual.working;
    });
    await _delayStep();

    final bool btOk = await mesh.checkAndEnableBluetooth();
    if (!mounted) return;

    if (!btOk) {
      setState(() {
        _permissionsBusy = false;
        _btStep = _StepVisual.error;
        _permissionError =
            'Please turn Bluetooth on or allow access in system settings.';
      });
      return;
    }

    setState(() => _btStep = _StepVisual.done);
    await _delayStep();

    if (!mounted) return;
    setState(() {
      _permissionsBusy = false;
      _phase = _OnboardingPhase.authentication;
    });
  }

  Future<void> _onVerifyOtp() async {
    final String code =
        _otpController.text.trim().replaceAll(RegExp(r'\s+'), '');
    if (code.length != 6 || int.tryParse(code) == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Enter the 6-digit Command Center authorization code.',
          ),
        ),
      );
      return;
    }
    setState(() => _otpVerifying = true);
    try {
      final IdentityService ids = IdentityService();
      ids.verifyVolunteerOtp(code);
      if (_returningUser) {
        if (!mounted) return;
        Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(
            builder: (BuildContext context) => const DashboardScreen(),
          ),
        );
        return;
      }
      await ids.createIdentityAfterOtpVerification();
      if (!mounted) return;
      setState(() => _phase = _OnboardingPhase.form);
      WidgetsBinding.instance.addPostFrameCallback((_) => _ensureFormIdentity());
    } on IdentityVerificationException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } on Object catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Verification failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _otpVerifying = false);
    }
  }

  /// Creates/loads identity so the profile screen can show a peer QR before submit.
  Future<void> _ensureFormIdentity() async {
    if (_previewIdentityLoading ||
        _previewNodeId != null ||
        _phase != _OnboardingPhase.form) {
      return;
    }
    setState(() {
      _previewIdentityLoading = true;
      _previewIdentityError = null;
    });
    try {
      final IdentityBootstrapResult r = await IdentityService().bootstrap();
      if (!mounted) return;
      setState(() {
        _previewNodeId = r.nodeId;
        _previewPublicKeyB64 = r.publicKeyBase64;
        _previewIdentityLoading = false;
      });
    } on Object catch (e) {
      if (!mounted) return;
      setState(() {
        _previewIdentityError = e;
        _previewIdentityLoading = false;
      });
    }
  }

  Future<void> _onSubmit() async {
    final String name = _displayNameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a display name.')),
      );
      return;
    }
    setState(() => _submitting = true);
    try {
      final IdentityBootstrapResult result =
          await IdentityService().bootstrap();
      await LocalLedger.instance.upsertNode(
        result.nodeId,
        result.publicKeyBase64,
        _selectedRole.value,
        'SELF',
      );
      const FlutterSecureStorage storage = FlutterSecureStorage();
      await storage.write(key: kDisplayNameStorageKey, value: name);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(
          builder: (BuildContext context) => const DashboardScreen(),
        ),
      );
    } on IdentityNotReadyException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } on Object catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Registration failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  void dispose() {
    _otpController.dispose();
    _displayNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme cs = Theme.of(context).colorScheme;

    switch (_phase) {
      case _OnboardingPhase.loading:
        return Scaffold(
          body: Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  cs.primaryContainer.withValues(alpha: 0.85),
                  cs.secondaryContainer.withValues(alpha: 0.65),
                  cs.surface,
                ],
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const SizedBox(height: 24),
                    Text(
                      'Digital Delta',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: cs.onSurface,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Preparing your secure mesh identity…',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: cs.onSurfaceVariant,
                          ),
                    ),
                    const SizedBox(height: 40),
                    _ChecklistTile(
                      label: 'Checking for saved identity key',
                      state: _keyStep,
                    ),
                    const SizedBox(height: 16),
                    _ChecklistTile(
                      label: 'Preparing next step',
                      state: _secondLoadingStep,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      case _OnboardingPhase.permissions:
        return Scaffold(
          body: Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  cs.tertiaryContainer.withValues(alpha: 0.7),
                  cs.primaryContainer.withValues(alpha: 0.5),
                  cs.surface,
                ],
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      'Permissions & radio',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'We need Bluetooth (scan, connect, and on Android 12+ '
                      'advertising so others can find you). You approve once — '
                      'the system cannot enable advertising without your consent.',
                      style: TextStyle(color: cs.onSurfaceVariant),
                    ),
                    const SizedBox(height: 28),
                    _ChecklistTile(
                      label: 'Bluetooth & location permissions',
                      state: _permStep,
                    ),
                    const SizedBox(height: 16),
                    _ChecklistTile(
                      label: 'Bluetooth powered on',
                      state: _btStep,
                    ),
                    if (_permissionsBusy) ...<Widget>[
                      const SizedBox(height: 24),
                      const Center(
                        child: SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(strokeWidth: 2.5),
                        ),
                      ),
                    ],
                    if (_permissionError != null) ...<Widget>[
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: cs.errorContainer,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: <Widget>[
                            Icon(Icons.info_outline, color: cs.onErrorContainer),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                _permissionError!,
                                style: TextStyle(color: cs.onErrorContainer),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const Spacer(),
                    FilledButton.icon(
                      onPressed: _permissionsBusy ? null : _runPermissionFlow,
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      case _OnboardingPhase.authentication:
        return Scaffold(
          body: Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  cs.primaryContainer.withValues(alpha: 0.65),
                  cs.tertiaryContainer.withValues(alpha: 0.55),
                  cs.surface,
                ],
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      _returningUser ? 'Welcome back' : 'Command Center authorization',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _returningUser
                          ? 'Each session requires the current 6-digit Command Center '
                              'code (offline TOTP). Enter it to continue.'
                          : 'Offline verification: enter the current 6-digit code from '
                              'the Command Center authenticator (same secret as this prototype build).',
                      style: TextStyle(color: cs.onSurfaceVariant),
                    ),
                    const SizedBox(height: 28),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            TextField(
                              controller: _otpController,
                              keyboardType: TextInputType.number,
                              maxLength: 6,
                              textInputAction: TextInputAction.done,
                              autocorrect: false,
                              enableSuggestions: false,
                              decoration: const InputDecoration(
                                labelText:
                                    '6-Digit Command Center Authorization Code',
                                counterText: '',
                                prefixIcon: Icon(Icons.pin_outlined),
                              ),
                              onSubmitted: (_) {
                                if (!_otpVerifying) {
                                  _onVerifyOtp();
                                }
                              },
                            ),
                            const SizedBox(height: 20),
                            FilledButton.icon(
                              onPressed: _otpVerifying ? null : _onVerifyOtp,
                              icon: _otpVerifying
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Icon(Icons.verified_user_outlined),
                              label: Text(_otpVerifying ? 'Verifying…' : 'Verify'),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    StreamBuilder<int>(
                      stream: _otpDevHintTick,
                      builder: (BuildContext context, AsyncSnapshot<int> _) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            Text(
                              'Dev · current code: '
                              '${IdentityService.debugCurrentCommandCenterTotp()}',
                              textAlign: TextAlign.center,
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: cs.onSurfaceVariant
                                        .withValues(alpha: 0.9),
                                    fontFamily: 'monospace',
                                    fontSize: 12,
                                    letterSpacing: 0.8,
                                  ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Remove this hint before production.',
                              textAlign: TextAlign.center,
                              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                    color: cs.onSurfaceVariant
                                        .withValues(alpha: 0.55),
                                  ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      case _OnboardingPhase.form:
        return Scaffold(
          body: Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: <Color>[
                  cs.secondaryContainer.withValues(alpha: 0.75),
                  cs.surface,
                ],
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      'Your profile',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'This name and role are shared with trusted peers.',
                      style: TextStyle(color: cs.onSurfaceVariant),
                    ),
                    const SizedBox(height: 28),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            TextField(
                              controller: _displayNameController,
                              decoration: const InputDecoration(
                                labelText: 'Display name',
                                prefixIcon: Icon(Icons.person_outline_rounded),
                              ),
                              textCapitalization: TextCapitalization.words,
                            ),
                            const SizedBox(height: 20),
                            InputDecorator(
                              decoration: const InputDecoration(
                                labelText: 'Role',
                                prefixIcon: Icon(Icons.badge_outlined),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<Role>(
                                  value: _selectedRole,
                                  isExpanded: true,
                                  borderRadius: BorderRadius.circular(12),
                                  items: Role.values
                                      .where(
                                        (Role r) => r != Role.ROLE_UNSPECIFIED,
                                      )
                                      .map(
                                        (Role r) => DropdownMenuItem<Role>(
                                          value: r,
                                          child: Text(_roleLabel(r)),
                                        ),
                                      )
                                      .toList(),
                                  onChanged: _submitting
                                      ? null
                                      : (Role? r) {
                                          if (r != null) {
                                            setState(() => _selectedRole = r);
                                          }
                                        },
                                ),
                              ),
                            ),
                            const SizedBox(height: 28),
                            FilledButton(
                              onPressed: _submitting ? null : _onSubmit,
                              child: _submitting
                                  ? const SizedBox(
                                      height: 22,
                                      width: 22,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Text('Create identity & continue'),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    if (_previewIdentityLoading)
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Row(
                            children: <Widget>[
                              SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: cs.primary,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Text(
                                  'Preparing peer QR…',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    else if (_previewIdentityError != null)
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: <Widget>[
                              Icon(Icons.error_outline, color: cs.error),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'QR: $_previewIdentityError',
                                  style: TextStyle(color: cs.error),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    else if (_previewNodeId != null &&
                        _previewPublicKeyB64 != null)
                      PeerQrSection(
                        nodeId: _previewNodeId!,
                        publicKeyBase64: _previewPublicKeyB64!,
                        compact: true,
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
    }
  }

  static String _roleLabel(Role r) {
    if (r == Role.FIELD_VOLUNTEER) return 'Field volunteer';
    if (r == Role.SUPPLY_MANAGER) return 'Supply manager';
    if (r == Role.DRONE_OPERATOR) return 'Drone operator';
    if (r == Role.CAMP_COMMANDER) return 'Camp commander';
    if (r == Role.SYNC_ADMIN) return 'Sync admin';
    if (r == Role.ROLE_UNSPECIFIED) return 'Unspecified';
    return r.name;
  }
}

class _ChecklistTile extends StatelessWidget {
  const _ChecklistTile({
    required this.label,
    required this.state,
  });

  final String label;
  final _StepVisual state;

  @override
  Widget build(BuildContext context) {
    final ColorScheme cs = Theme.of(context).colorScheme;
    Widget trailing;
    switch (state) {
      case _StepVisual.pending:
        trailing = Icon(Icons.radio_button_unchecked_rounded, color: cs.outline);
        break;
      case _StepVisual.working:
        trailing = SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(
            strokeWidth: 2.5,
            color: cs.primary,
          ),
        );
        break;
      case _StepVisual.done:
        trailing = Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            color: cs.primary,
            shape: BoxShape.circle,
            boxShadow: <BoxShadow>[
              BoxShadow(
                color: cs.primary.withValues(alpha: 0.35),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Icon(Icons.check_rounded, color: cs.onPrimary, size: 20),
        );
        break;
      case _StepVisual.error:
        trailing = Icon(Icons.close_rounded, color: cs.error, size: 28);
        break;
    }

    final bool dim = state == _StepVisual.pending;
    return AnimatedOpacity(
      opacity: dim ? 0.55 : 1,
      duration: const Duration(milliseconds: 280),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: cs.surfaceContainerHighest.withValues(alpha: 0.65),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: state == _StepVisual.done
                ? cs.primary.withValues(alpha: 0.45)
                : cs.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        child: Row(
          children: <Widget>[
            Expanded(
              child: Text(
                label,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
            ),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 320),
              child: trailing,
            ),
          ],
        ),
      ),
    );
  }
}
