-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rentvehicle
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `rentvehicle` ;

-- -----------------------------------------------------
-- Schema rentvehicle
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rentvehicle` DEFAULT CHARACTER SET utf8 ;
USE `rentvehicle` ;

-- -----------------------------------------------------
-- Table `rentvehicle`.`vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`vehicle` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(255) NOT NULL DEFAULT 'free',
  `image` MEDIUMBLOB NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`manufacturer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`manufacturer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `fax` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL,
  `deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`car_manufacturer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`car_manufacturer` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_car_manufacturer_manufacturer1_idx` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_car_manufacturer_manufacturer1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`car`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`car` (
  `id` INT NOT NULL,
  `car_id` VARCHAR(255) NOT NULL,
  `buy_date` DATE NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  `description` VARCHAR(1000) NULL,
  `model` VARCHAR(255) NOT NULL,
  `manufacturer_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_car_vehicle1_idx` (`id` ASC) VISIBLE,
  INDEX `fk_car_car_manufacturer1_idx` (`manufacturer_id` ASC) VISIBLE,
  UNIQUE INDEX `car_id_UNIQUE` (`car_id` ASC) VISIBLE,
  CONSTRAINT `fk_car_vehicle1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_car_car_manufacturer1`
    FOREIGN KEY (`manufacturer_id`)
    REFERENCES `rentvehicle`.`car_manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`bike_manufacturer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`bike_manufacturer` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bike_manufacturer_manufacturer1_idx` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_bike_manufacturer_manufacturer1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`bike`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`bike` (
  `id` INT NOT NULL,
  `bike_id` VARCHAR(255) NOT NULL,
  `price` DECIMAL(6,2) NOT NULL,
  `bike_range` VARCHAR(255) NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `manufacturer_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bike_vehicle1_idx` (`id` ASC) VISIBLE,
  INDEX `fk_bike_bike_manufacturer1_idx` (`manufacturer_id` ASC) VISIBLE,
  UNIQUE INDEX `bike_id_UNIQUE` (`bike_id` ASC) VISIBLE,
  CONSTRAINT `fk_bike_vehicle1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bike_bike_manufacturer1`
    FOREIGN KEY (`manufacturer_id`)
    REFERENCES `rentvehicle`.`bike_manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`scooter_manufacturer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`scooter_manufacturer` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_scooter_manufacturer_manufacturer1_idx` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_scooter_manufacturer_manufacturer1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`scooter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`scooter` (
  `id` INT NOT NULL,
  `scooter_id` VARCHAR(255) NOT NULL,
  `price` DECIMAL(6,2) NOT NULL,
  `speed` INT NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `manufacturer_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_scooter_vehicle1_idx` (`id` ASC) VISIBLE,
  INDEX `fk_scooter_scooter_manufacturer1_idx` (`manufacturer_id` ASC) VISIBLE,
  UNIQUE INDEX `scooter_id_UNIQUE` (`scooter_id` ASC) VISIBLE,
  CONSTRAINT `fk_scooter_vehicle1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_scooter_scooter_manufacturer1`
    FOREIGN KEY (`manufacturer_id`)
    REFERENCES `rentvehicle`.`scooter_manufacturer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`malfunction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`malfunction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(1000) NOT NULL,
  `date_time` DATETIME NOT NULL,
  `vehicle_id` INT NOT NULL,
  `solved` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_malfunction_vehicle1_idx` (`vehicle_id` ASC) VISIBLE,
  CONSTRAINT `fk_malfunction_vehicle1`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `rentvehicle`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`account` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `surname` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`document`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`document` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `number` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`client` (
  `id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `image` MEDIUMBLOB NULL,
  `document_id` INT NOT NULL,
  `blocked` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_client_account1_idx` (`id` ASC) VISIBLE,
  INDEX `fk_client_document1_idx` (`document_id` ASC) VISIBLE,
  CONSTRAINT `fk_client_account1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_client_document1`
    FOREIGN KEY (`document_id`)
    REFERENCES `rentvehicle`.`document` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`rent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`rent` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NOT NULL,
  `taken_x` VARCHAR(255) NOT NULL,
  `taken_y` VARCHAR(255) NOT NULL,
  `left_x` VARCHAR(255) NOT NULL,
  `left_y` VARCHAR(255) NOT NULL,
  `duration` DATETIME NULL,
  `vehicle_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_rent_vehicle1_idx` (`vehicle_id` ASC) VISIBLE,
  INDEX `fk_rent_client1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_rent_vehicle1`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `rentvehicle`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rent_client1`
    FOREIGN KEY (`client_id`)
    REFERENCES `rentvehicle`.`client` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`car_rent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`car_rent` (
  `id` INT NOT NULL,
  `licence_number` VARCHAR(255) NOT NULL,
  `document_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_car_rent_document1_idx` (`document_id` ASC) VISIBLE,
  CONSTRAINT `fk_car_rent_rent1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`rent` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_car_rent_document1`
    FOREIGN KEY (`document_id`)
    REFERENCES `rentvehicle`.`document` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`passport`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`passport` (
  `id` INT NOT NULL,
  `passport_number` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `passport_number_UNIQUE` (`passport_number` ASC) VISIBLE,
  CONSTRAINT `fk_passport_document1`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`document` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`employee` (
  `id` INT NOT NULL,
  `role` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_employee_table11`
    FOREIGN KEY (`id`)
    REFERENCES `rentvehicle`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` VARCHAR(20000) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rentvehicle`.`promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentvehicle`.`promotion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `description` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
