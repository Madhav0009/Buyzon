package com.example.Buyzon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Buyzon.entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
}
