import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../providers/data_provider.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  bool _isAdding = false;
  final TextEditingController _nameCtrl = TextEditingController();
  final TextEditingController _skuCtrl = TextEditingController();
  final TextEditingController _qtyCtrl = TextEditingController();

  void _handleAdd(DataProvider data) {
    if (_nameCtrl.text.isNotEmpty && _skuCtrl.text.isNotEmpty) {
      data.addItem({
        'name': _nameCtrl.text,
        'sku': _skuCtrl.text,
        'quantity': int.tryParse(_qtyCtrl.text) ?? 0,
        'category': 'Active Supply',
        'timestamp': DateTime.now().toString(),
      });
      _nameCtrl.clear();
      _skuCtrl.clear();
      _qtyCtrl.clear();
      setState(() => _isAdding = false);
    }
  }

  void _showItemDetails(BuildContext context, Map<String, dynamic> item, DataProvider data) {
    bool isEditing = false;
    final editNameCtrl = TextEditingController(text: item['name']);
    final editSkuCtrl = TextEditingController(text: item['sku']);
    final editQtyCtrl = TextEditingController(text: item['quantity'].toString());
    final editCatCtrl = TextEditingController(text: item['category'] ?? 'General');

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Dialog(
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          style: IconButton.styleFrom(backgroundColor: isEditing ? AppColors.accentGreen : const Color(0xFFF1F5F9)),
                          icon: Icon(isEditing ? Icons.check : Icons.edit, color: isEditing ? Colors.white : AppColors.surface),
                          onPressed: () => setModalState(() => isEditing = !isEditing),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: AppColors.textMuted),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    if (isEditing) ...[
                      const Text("Edit Information", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.surface)),
                      const SizedBox(height: 15),
                      TextField(controller: editNameCtrl, decoration: _inputDeco('Item Name')),
                      const SizedBox(height: 10),
                      TextField(controller: editSkuCtrl, decoration: _inputDeco('SKU Code')),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(child: TextField(controller: editQtyCtrl, keyboardType: TextInputType.number, decoration: _inputDeco('Units'))),
                          const SizedBox(width: 10),
                          Expanded(child: TextField(controller: editCatCtrl, decoration: _inputDeco('Category'))),
                        ],
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentGreen, minimumSize: const Size(double.infinity, 50)),
                        onPressed: () {
                          data.updateItem(item['id'], {
                            'name': editNameCtrl.text,
                            'sku': editSkuCtrl.text,
                            'quantity': int.tryParse(editQtyCtrl.text) ?? 0,
                            'category': editCatCtrl.text,
                          });
                          Navigator.pop(context);
                        },
                        child: const Text('SAVE UPDATES', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      )
                    ] else ...[
                      Text(item['sku'], style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, letterSpacing: 2)),
                      const SizedBox(height: 5),
                      Text(item['name'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.surface)),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(child: _infoBox('Current Stock', '${item['quantity']} Units')),
                          const SizedBox(width: 10),
                          Expanded(child: _infoBox('Category', item['category'] ?? 'General')),
                        ],
                      ),
                    ]
                  ],
                ),
              ),
            );
          }
        );
      }
    );
  }

  void _showDeleteConfirm(BuildContext context, String id, DataProvider data) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), shape: BoxShape.circle),
              child: const Icon(Icons.delete_outline, color: AppColors.primary, size: 35),
            ),
            const SizedBox(height: 15),
            const Text("Remove Item?", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.surface)),
            const SizedBox(height: 10),
            const Text("This will permanently erase this SKU from the Registry.", textAlign: TextAlign.center, style: TextStyle(color: AppColors.textMuted)),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    style: TextButton.styleFrom(backgroundColor: const Color(0xFFF1F5F9), padding: const EdgeInsets.symmetric(vertical: 15)),
                    child: const Text('KEEP', style: TextStyle(color: AppColors.surface, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      data.deleteItem(id);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(vertical: 15)),
                    child: const Text('DELETE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            )
          ],
        ),
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<DataProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 10),
          child: IconButton(
            style: IconButton.styleFrom(backgroundColor: Colors.white),
            icon: const Icon(Icons.chevron_left, color: AppColors.surface),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        title: const Text('Registry', style: TextStyle(color: AppColors.text, fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 15),
            child: IconButton(
              style: IconButton.styleFrom(backgroundColor: _isAdding ? AppColors.primary : Colors.white),
              icon: Icon(_isAdding ? Icons.close : Icons.add, color: _isAdding ? Colors.white : AppColors.surface),
              onPressed: () => setState(() => _isAdding = !_isAdding),
            ),
          )
        ],
      ),
      body: Column(
        children: [
          if (_isAdding)
            Container(
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
              child: Column(
                children: [
                  TextField(controller: _nameCtrl, decoration: _inputDeco('Item Description')),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(flex: 2, child: TextField(controller: _skuCtrl, decoration: _inputDeco('SKU'))),
                      const SizedBox(width: 10),
                      Expanded(flex: 1, child: TextField(controller: _qtyCtrl, keyboardType: TextInputType.number, decoration: _inputDeco('Qty'))),
                    ],
                  ),
                  const SizedBox(height: 15),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.surface, minimumSize: const Size(double.infinity, 50)),
                    onPressed: () => _handleAdd(data),
                    child: const Text('ADD TO INVENTORY', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            ),
            
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: data.inventory.length,
              itemBuilder: (context, index) {
                final item = data.inventory[index];
                final qty = item['quantity'] as int;
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _showItemDetails(context, item, data),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(item['sku'], style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                                  const SizedBox(width: 8),
                                  Container(width: 6, height: 6, decoration: BoxDecoration(color: qty > 0 ? AppColors.accentGreen : AppColors.primary, shape: BoxShape.circle))
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(item['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.surface), maxLines: 1, overflow: TextOverflow.ellipsis),
                              Text(item['category'] ?? 'General', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
                        child: Column(
                          children: [
                            const Text('STOCK', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                            Text('$qty', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.surface)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      IconButton(
                        style: IconButton.styleFrom(backgroundColor: AppColors.primary.withOpacity(0.1)),
                        icon: const Icon(Icons.delete_outline, color: AppColors.primary, size: 20),
                        onPressed: () => _showDeleteConfirm(context, item['id'], data),
                      )
                    ],
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  InputDecoration _inputDeco(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: const Color(0xFFF8FAFC),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
    );
  }

  Widget _infoBox(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(15), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.bold)),
          const SizedBox(height: 5),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.surface)),
        ],
      ),
    );
  }
}