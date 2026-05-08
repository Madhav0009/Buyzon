package com.example.Buyzon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Buyzon.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}