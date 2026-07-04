-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Jul 04, 2026 at 01:51 PM
-- Server version: 8.4.10
-- PHP Version: 8.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virtualrealityth`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `symbol` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('FIAT','CRYPTO') COLLATE utf8mb4_general_ci NOT NULL,
  `precision_places` int DEFAULT '8',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `asset_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` decimal(36,18) NOT NULL,
  `status` enum('PENDING','CONFIRMED','FAILED') COLLATE utf8mb4_general_ci DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `asset_pair` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `side` enum('BUY','SELL') COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(36,18) NOT NULL,
  `original_amount` decimal(36,18) NOT NULL,
  `filled_amount` decimal(36,18) DEFAULT '0.000000000000000000',
  `status` enum('OPEN','PARTIAL','FILLED','CANCELLED') COLLATE utf8mb4_general_ci DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `buy_order_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `sell_order_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(36,18) NOT NULL,
  `amount` decimal(36,18) NOT NULL,
  `fee` decimal(36,18) DEFAULT '0.000000000000000000',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `from_user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `to_user_id` char(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `asset_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` decimal(36,18) NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') COLLATE utf8mb4_general_ci DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('ACTIVE','SUSPENDED','CLOSED') COLLATE utf8mb4_general_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `asset_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `available_balance` decimal(36,18) DEFAULT '0.000000000000000000',
  `locked_balance` decimal(36,18) DEFAULT '0.000000000000000000',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `asset_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` decimal(36,18) NOT NULL,
  `fee` decimal(36,18) DEFAULT '0.000000000000000000',
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('PENDING','PROCESSING','CONFIRMED','REJECTED') COLLATE utf8mb4_general_ci DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `symbol` (`symbol`);

--
-- Indexes for table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_pair` (`asset_pair`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_buy_order` (`buy_order_id`),
  ADD KEY `idx_sell_order` (`sell_order_id`);

--
-- Indexes for table `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_from_user` (`from_user_id`),
  ADD KEY `idx_to_user` (`to_user_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_asset` (`user_id`,`asset_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_asset_id` (`asset_id`);

--
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deposits`
--
ALTER TABLE `deposits`
  ADD CONSTRAINT `deposits_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  ADD CONSTRAINT `deposits_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `trades`
--
ALTER TABLE `trades`
  ADD CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`buy_order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `trades_ibfk_2` FOREIGN KEY (`sell_order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `transfers`
--
ALTER TABLE `transfers`
  ADD CONSTRAINT `transfers_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`);

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `wallets_ibfk_2` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`);

--
-- Constraints for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  ADD CONSTRAINT `withdrawals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
