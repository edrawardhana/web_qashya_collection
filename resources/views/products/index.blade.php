@extends('layout')

@section('content')
<div class="container mt-4">
    <h1>Daftar Produk Qashya Collection</h1>
    <a href="{{ route('products.create') }}" class="btn btn-primary mb-3">Tambah Produk</a>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $p)
            <tr>
                <td>
    @if ($p->gambar)
        <img src="{{ asset('storage/' . $p->gambar) }}" width="100" alt="Gambar Produk">
    @else
        Tidak ada gambar
    @endif
</td>

                <td>{{ $p->nama }}</td>
                <td>Rp {{ number_format($p->harga, 0, ',', '.') }}</td>
                <td>{{ $p->stok }}</td>
                <td>
                    <a href="{{ route('products.edit', $p->id) }}" class="btn btn-warning btn-sm">Edit</a>
                    <form action="{{ route('products.destroy', $p->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger btn-sm" onclick="return confirm('Yakin hapus produk ini?')">Hapus</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
