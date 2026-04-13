import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';
import 'route_optimization_screen.dart';

// --- CUSTOM LOGISTIC REGRESSION MODEL ---
class LogisticRegression {
  List<double> weights = [0.0, 0.0, 0.0];
  double bias = 2.0;
  final double lr = 0.1;

  double sigmoid(double z) {
    return 1.0 / (1.0 + exp(-z));
  }

  void train(List<List<double>> X, List<int> y, int epochs) {
    for (int e = 0; e < epochs; e++) {
      for (int i = 0; i < X.length; i++) {
        double linearModel = bias;
        for (int j = 0; j < weights.length; j++) {
          linearModel += weights[j] * X[i][j];
        }
        double yPredicted = sigmoid(linearModel);
        double error = yPredicted - y[i];

        for (int j = 0; j < weights.length; j++) {
          weights[j] -= lr * error * X[i][j];
        }
        bias -= lr * error;
      }
    }
  }

  double predictProbability(List<double> x) {
    double linearModel = bias;
    for (int j = 0; j < weights.length; j++) {
      linearModel += weights[j] * x[j];
    }
    return sigmoid(linearModel);
  }
}

class PredictScreen extends StatefulWidget {
  final Map<String, dynamic> destination;

  const PredictScreen({super.key, required this.destination});

  @override
  State<PredictScreen> createState() => _PredictScreenState();
}

class _PredictScreenState extends State<PredictScreen> {
  final LogisticRegression _model = LogisticRegression();
  
  double _accuracy = 0.0;
  double _precision = 0.0;
  double _recall = 0.0;
  double _f1 = 0.0;
  bool _isTraining = true;

  List<Map<String, dynamic>> _allPredictions = [];
  final List<Map<String, dynamic>> _displayedPredictions = [];
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _runMachineLearningPipeline();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _runMachineLearningPipeline() async {
    List<List<double>> X_train = [];
    List<int> y_train = [];
    Random rnd = Random(42); 

    for (int i = 0; i < 550; i++) {
      double rain = rnd.nextDouble() * 200; 
      double roc = rnd.nextDouble() * 10;
      double elev = rnd.nextDouble() * 50;
      double vulnerabilityScore = (rain / 200) + (roc / 10) - (elev / 50);
      int isFlooded = vulnerabilityScore > 0.5 ? 1 : 0;

      X_train.add([rain / 200, roc / 10, elev / 50]);
      y_train.add(isFlooded);
    }

    _model.train(X_train, y_train, 1000);

    int tp = 0, tn = 0, fp = 0, fn = 0;
    for (int i = 0; i < X_train.length; i++) {
      double prob = _model.predictProbability(X_train[i]);
      int pred = prob > 0.5 ? 1 : 0;  // .5
      
      if (pred == 1 && y_train[i] == 1) tp++;
      if (pred == 0 && y_train[i] == 0) tn++;
      if (pred == 1 && y_train[i] == 0) fp++;
      if (pred == 0 && y_train[i] == 1) fn++;
    }

    setState(() {
      _accuracy = (tp + tn) / X_train.length;
      _precision = (tp + fp) == 0 ? 0.0 : tp / (tp + fp);
      _recall = (tp + fn) == 0 ? 0.0 : tp / (tp + fn);
      _f1 = (_precision + _recall) == 0 ? 0.0 : 2 * _precision * _recall / (_precision + _recall);
      _isTraining = false;
    });

    final provider = context.read<DataProvider>();
    await Future.delayed(const Duration(milliseconds: 500));

    int forcedFloods = 0;

    for (var edge in provider.edges) {

      

      if (edge['id'] == 'E1') continue; 

      

      double rain, roc, elev;

      if (forcedFloods < 2) {
        rain = 180.0 + rnd.nextDouble() * 20; 
        roc = 8.0 + rnd.nextDouble() * 2;     
        elev = rnd.nextDouble() * 10;         
      } else {
        rain = rnd.nextDouble() * 200;
        roc = rnd.nextDouble() * 10;
        elev = rnd.nextDouble() * 50;
      }

      double prob = _model.predictProbability([rain / 200, roc / 10, elev / 50]);

      if (prob > 0.7) {
        forcedFloods++;
        
        // CRITICAL FIX: Commit to Global State IMMEDIATELY. 
        // This ensures if the user clicks "New Routing" right away, the map remembers it!
        provider.updateEdgeStatus(edge['id'], true);

        final sourceNode = provider.nodes.firstWhere((n) => n['id'] == edge['source'], orElse: () => {'name': 'Unknown'});
        final targetNode = provider.nodes.firstWhere((n) => n['id'] == edge['target'], orElse: () => {'name': 'Unknown'});
        
        _allPredictions.add({
          'edgeId': edge['id'],
          'name': '${sourceNode['name']} ➔ ${targetNode['name']}',
          'rain': rain.toStringAsFixed(1),
          'elev': elev.toStringAsFixed(1),
          'prob': (prob * 100).toStringAsFixed(1),
        });
      }
    }

    // 5. Start Sequential UI Animation Loop (Visual Only)
    int currentIndex = 0;
    _timer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (currentIndex < _allPredictions.length) {
        setState(() {
          _displayedPredictions.add(_allPredictions[currentIndex]);
        });
        currentIndex++;
      } else {
        timer.cancel();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black87),
        title: const Text(
          'Predictive Logistics Engine', 
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 16)
        ),
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.alt_route, color: AppColors.primary, size: 18),
            label: const Text('New Routing', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
            onPressed: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => RouteOptimizationScreen(destination: widget.destination),
                ),
              );
            },
          )
        ],
      ),
      body: _isTraining 
        ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
        : Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MODEL PERFORMANCE (LOGISTIC REGRESSION)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.black54, letterSpacing: 1.2)),
                const SizedBox(height: 15),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _metricCard('Accuracy', '${(_accuracy * 100).toStringAsFixed(1)}%'),
                    _metricCard('F1 Score', _f1.toStringAsFixed(2)),
                    _metricCard('Precision', _precision.toStringAsFixed(2)),
                    _metricCard('Recall', _recall.toStringAsFixed(2)),
                  ],
                ),
                
                const SizedBox(height: 30),
                const Divider(color: Colors.black12),
                const SizedBox(height: 10),
                
                const Text('REAL-TIME FLOOD DETECTIONS (Prob > 70%)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.black54, letterSpacing: 1.2)),
                const SizedBox(height: 15),

                Expanded(
                  child: ListView.builder(
                    itemCount: _displayedPredictions.length,
                    itemBuilder: (context, index) {
                      final item = _displayedPredictions[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFCA5A5)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.warning_amber_rounded, color: Colors.red, size: 24),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item['name'], style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 14)),
                                  const SizedBox(height: 4),
                                  Text('Rainfall: ${item['rain']}mm | Elev: ${item['elev']}m', style: const TextStyle(color: Colors.black54, fontSize: 12)),
                                  const SizedBox(height: 2),
                                  Text('Probability: ${item['prob']}%', style: const TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            const Text('CRITICAL', style: TextStyle(color: Colors.red, fontSize: 10, fontWeight: FontWeight.w900)),
                          ],
                        ),
                      );
                    },
                  ),
                )
              ],
            ),
        ),
    );
  }

  Widget _metricCard(String title, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primary)),
          const SizedBox(height: 6),
          Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.black54)),
        ],
      ),
    );
  }
}