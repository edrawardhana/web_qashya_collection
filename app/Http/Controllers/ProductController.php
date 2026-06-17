<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return view('products.index', compact('products'));
    }

    //POST atau CREATE
    public function create()
    {
        return view('products.create');
    }

    //EDIT
    public function edit(Product $product)
{
    return view('products.edit', compact('product'));
}
public function update(Request $request, Product $product)
{
    $request->validate([
        'nama' => 'required',
        'harga' => 'required|numeric',
        'stok' => 'required|integer',
    ]);

    $product->update($request->all());
    return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
}


public function destroy(Product $product)
{
    $product->delete();
    return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
}


public function store(Request $request)
{
    $request->validate([
        'nama' => 'required',
        'harga' => 'required|numeric',
        'stok' => 'required|integer',
        'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
    ]);

    $data = $request->all();

    if ($request->hasFile('gambar')) {
        // simpan ke storage/app/public/products
        $path = $request->file('gambar')->store('products', 'public');
        $data['gambar'] = $path; // hanya "products/namafile.jpg"
    }

    Product::create($data);

    return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
}

}
