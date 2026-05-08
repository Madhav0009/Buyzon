package com.example.Buyzon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Buyzon.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}