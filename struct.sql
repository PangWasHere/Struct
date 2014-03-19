-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 06, 2014 at 04:38 PM
-- Server version: 5.6.13
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `struct`
--
CREATE DATABASE IF NOT EXISTS `struct` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `struct`;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE IF NOT EXISTS `class` (
  `class_ID` int(11) NOT NULL AUTO_INCREMENT,
  `class_subj_code` varchar(10) NOT NULL,
  `class_adviser` int(11) DEFAULT NULL,
  `class_schedule` varchar(25) NOT NULL,
  `school_year` int(11) NOT NULL,
  `semester` enum('1st','2nd','summer') NOT NULL,
  PRIMARY KEY (`class_ID`),
  KEY `class_adviser` (`class_adviser`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_ID`, `class_subj_code`, `class_adviser`, `class_schedule`, `school_year`, `semester`) VALUES
(1, 'CS126', 2, 'MWF 01:30PM-02:30PM', 2013, '1st'),
(2, 'CS126', 2, 'MWF 03:30PM-04:30PM', 2013, '1st'),
(3, 'CS116', 2, 'TTH 07:30AM-09:00AM', 2013, '1st'),
(17, 'PSYCH11', 2, 'MWF 1:30AM-5:00Am', 2014, '2nd'),
(19, 'CS129', 2, 'MWF 01:30PM-02:30PM', 0, '1st');

-- --------------------------------------------------------

--
-- Table structure for table `class_list`
--

CREATE TABLE IF NOT EXISTS `class_list` (
  `class_ID` int(11) NOT NULL,
  `player_ID` int(11) NOT NULL,
  `final_grade` float NOT NULL,
  `midterm_grade` float NOT NULL,
  `status` varchar(25) NOT NULL,
  KEY `class_ID` (`class_ID`,`player_ID`),
  KEY `player_ID` (`player_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `class_list`
--

INSERT INTO `class_list` (`class_ID`, `player_ID`, `final_grade`, `midterm_grade`, `status`) VALUES
(3, 1, 0, 0, 'OK');

-- --------------------------------------------------------

--
-- Table structure for table `concepts`
--

CREATE TABLE IF NOT EXISTS `concepts` (
  `concept_ID` int(11) NOT NULL AUTO_INCREMENT,
  `concept_name` varchar(50) NOT NULL,
  PRIMARY KEY (`concept_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `concepts`
--

INSERT INTO `concepts` (`concept_ID`, `concept_name`) VALUES
(1, 'Array Accessing'),
(2, 'Linked List');

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE IF NOT EXISTS `exam` (
  `exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `concept_id` int(11) DEFAULT NULL,
  `exam_path` varchar(250) NOT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `concept_id` (`concept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE IF NOT EXISTS `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ID` int(11) NOT NULL,
  `class_ID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_ID`,`class_ID`),
  KEY `class_id` (`class_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`id`, `user_ID`, `class_ID`) VALUES
(1, 1, 3),
(6, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `puzzle`
--

CREATE TABLE IF NOT EXISTS `puzzle` (
  `puzzle_ID` int(11) NOT NULL AUTO_INCREMENT,
  `puzzle_name` varchar(50) NOT NULL,
  `puzzle_creator` varchar(50) NOT NULL,
  `added_on` date NOT NULL,
  `puzzle_descriptions` varchar(250) NOT NULL,
  PRIMARY KEY (`puzzle_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `puzzle`
--

INSERT INTO `puzzle` (`puzzle_ID`, `puzzle_name`, `puzzle_creator`, `added_on`, `puzzle_descriptions`) VALUES
(1, 'Book Collector', 'Farrah Marie Caberte', '2014-03-01', 'Understand the concepts of array accessing by collecting overdue books for the library.');

-- --------------------------------------------------------

--
-- Table structure for table `puzzle_concept`
--

CREATE TABLE IF NOT EXISTS `puzzle_concept` (
  `puzzle_ID` int(11) NOT NULL,
  `concept_ID` int(11) NOT NULL,
  KEY `puzzle_ID` (`puzzle_ID`),
  KEY `concept_ID` (`concept_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `puzzle_report`
--

CREATE TABLE IF NOT EXISTS `puzzle_report` (
  `puzzle_ID` int(11) NOT NULL,
  `player_ID` int(11) NOT NULL,
  `last_played_on` date NOT NULL,
  `score` int(11) NOT NULL,
  `meta` varchar(250) DEFAULT NULL,
  UNIQUE KEY `puzzle_ID` (`puzzle_ID`,`player_ID`),
  KEY `player_ID` (`player_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `puzzle_report`
--

INSERT INTO `puzzle_report` (`puzzle_ID`, `player_ID`, `last_played_on`, `score`, `meta`) VALUES
(1, 1, '2014-03-06', 7832, '<wrong_num>1</wrong_num><success_num>2</success_num><total_num>8</total_num>'),
(1, 2, '2014-03-06', 1007, '<wrong_num>0</wrong_num><success_num>1</success_num><total_num>4</total_num>');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_schedule`
--

CREATE TABLE IF NOT EXISTS `teacher_schedule` (
  `user_ID` int(11) NOT NULL,
  `schedule` varchar(25) NOT NULL,
  KEY `user_id` (`user_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_schedule`
--

INSERT INTO `teacher_schedule` (`user_ID`, `schedule`) VALUES
(2, '9:00AM-12:00NN');

-- --------------------------------------------------------

--
-- Table structure for table `tutorial`
--

CREATE TABLE IF NOT EXISTS `tutorial` (
  `tutorial_ID` int(11) NOT NULL AUTO_INCREMENT,
  `added_on` date NOT NULL,
  `tutorial_name` varchar(100) NOT NULL,
  `tutorial_reference` varchar(100) NOT NULL,
  PRIMARY KEY (`tutorial_ID`),
  KEY `tutorial_concept` (`added_on`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tutorial_concept`
--

CREATE TABLE IF NOT EXISTS `tutorial_concept` (
  `tutorial_ID` int(11) NOT NULL,
  `concept_ID` int(11) NOT NULL,
  KEY `tutorial_ID` (`tutorial_ID`),
  KEY `concept_ID` (`concept_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tutorial_report`
--

CREATE TABLE IF NOT EXISTS `tutorial_report` (
  `tutorial_ID` int(11) NOT NULL,
  `player_ID` int(11) NOT NULL,
  `last_read_on` date NOT NULL,
  `read_count` int(11) NOT NULL,
  `remarks` text NOT NULL,
  KEY `tutorial_ID` (`tutorial_ID`,`player_ID`),
  KEY `player_ID` (`player_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_ID` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` varchar(25) NOT NULL,
  `user_Fname` varchar(50) NOT NULL,
  `user_Mname` varchar(25) NOT NULL,
  `user_Lname` varchar(25) NOT NULL,
  `user_password` varchar(100) DEFAULT NULL,
  `user_status` varchar(25) NOT NULL,
  `user_type` varchar(1) NOT NULL,
  `image_path` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `school_id` (`school_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_ID`, `school_id`, `user_Fname`, `user_Mname`, `user_Lname`, `user_password`, `user_status`, `user_type`, `image_path`) VALUES
(1, '09305644', 'Farrah Marie', 'Credo', 'Caberte', '49d02d55ad10973b7b9d0dc9eba7fdf0', 'enrolled', 'S', NULL),
(2, '09301919', 'Al Cassey', 'Marino', 'Chavez', '518d5f3401534f5c6c21977f12f60989', 'employed', 'A', NULL),
(4, '130301010', 'Meah', 'Potter', 'Alisa', '202cb962ac59075b964b07152d234b70', 'enrolled', 'S', NULL),
(5, '123', '123', '123', '123', NULL, '123', 'T', NULL),
(6, '11101201', 'Airwrecka', 'Cajes', 'Fernando', '00da06ce3d7eb3287891ee154116e91f', 'its complicated', 'S', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`class_adviser`) REFERENCES `teacher_schedule` (`user_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `class_list`
--
ALTER TABLE `class_list`
  ADD CONSTRAINT `class_list_ibfk_2` FOREIGN KEY (`class_ID`) REFERENCES `class` (`class_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `class_list_ibfk_3` FOREIGN KEY (`player_ID`) REFERENCES `player` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `player_ibfk_2` FOREIGN KEY (`class_ID`) REFERENCES `class` (`class_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `player_ibfk_3` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `player_ibfk_4` FOREIGN KEY (`class_ID`) REFERENCES `class` (`class_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `puzzle_concept`
--
ALTER TABLE `puzzle_concept`
  ADD CONSTRAINT `puzzle_concept_ibfk_1` FOREIGN KEY (`concept_ID`) REFERENCES `concepts` (`concept_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `puzzle_IDFk` FOREIGN KEY (`puzzle_ID`) REFERENCES `puzzle` (`puzzle_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `puzzle_report`
--
ALTER TABLE `puzzle_report`
  ADD CONSTRAINT `puzzle_report_ibfk_1` FOREIGN KEY (`puzzle_ID`) REFERENCES `puzzle` (`puzzle_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `puzzle_report_ibfk_2` FOREIGN KEY (`player_ID`) REFERENCES `user` (`user_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `teacher_schedule`
--
ALTER TABLE `teacher_schedule`
  ADD CONSTRAINT `teacher_schedule_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_schedule_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON UPDATE CASCADE;

--
-- Constraints for table `tutorial_concept`
--
ALTER TABLE `tutorial_concept`
  ADD CONSTRAINT `tutorial_concept_ibfk_1` FOREIGN KEY (`tutorial_ID`) REFERENCES `tutorial` (`tutorial_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tutorial_concept_ibfk_2` FOREIGN KEY (`concept_ID`) REFERENCES `concepts` (`concept_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tutorial_report`
--
ALTER TABLE `tutorial_report`
  ADD CONSTRAINT `tutorial_report_ibfk_1` FOREIGN KEY (`tutorial_ID`) REFERENCES `tutorial` (`tutorial_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tutorial_report_ibfk_2` FOREIGN KEY (`player_ID`) REFERENCES `user` (`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
