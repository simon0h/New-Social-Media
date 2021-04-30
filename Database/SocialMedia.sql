--
-- Database: `SocialMedia`
--

-- --------------------------------------------------------

--
-- Table structure for table `belong`
--

DROP TABLE IF EXISTS `belong`;
CREATE TABLE IF NOT EXISTS `belong` (
  `email` varchar(20) NOT NULL,
  `owner_email` varchar(20) NOT NULL,
  `fg_name` varchar(20) NOT NULL,
  PRIMARY KEY (`email`,`owner_email`,`fg_name`),
  KEY `owner_email` (`owner_email`,`fg_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `c_id` int(20) NOT NULL AUTO_INCREMENT,
  `item_id` int(20) DEFAULT NULL,
  `email_post` varchar(20) DEFAULT NULL,
  `comment_time` timestamp NULL DEFAULT NULL,
  `comment_text` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  KEY `item_id` (`item_id`,`email_post`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `contentitem`
--

DROP TABLE IF EXISTS `contentitem`;
CREATE TABLE IF NOT EXISTS `contentitem` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `email_post` varchar(20) DEFAULT NULL,
  `post_time` timestamp NULL DEFAULT NULL,
  `file_path` varchar(100) DEFAULT NULL,
  `item_name` varchar(20) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `is_pub` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `email_post` (`email_post`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `friendgroup`
--

DROP TABLE IF EXISTS `friendgroup`;
CREATE TABLE IF NOT EXISTS `friendgroup` (
  `owner_email` varchar(20) NOT NULL,
  `fg_name` varchar(20) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`owner_email`,`fg_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `email` varchar(20) NOT NULL,
  `password` char(64) DEFAULT NULL,
  `fname` varchar(20) DEFAULT NULL,
  `lname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rate`
--

DROP TABLE IF EXISTS `rate`;
CREATE TABLE IF NOT EXISTS `rate` (
  `email` varchar(20) NOT NULL,
  `item_id` int(11) NOT NULL,
  `rate_time` timestamp NULL DEFAULT NULL,
  `emoji` varchar(20) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`email`,`item_id`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `share`
--

DROP TABLE IF EXISTS `share`;
CREATE TABLE IF NOT EXISTS `share` (
  `owner_email` varchar(20) NOT NULL,
  `fg_name` varchar(20) NOT NULL,
  `item_id` int(11) NOT NULL,
  PRIMARY KEY (`owner_email`,`fg_name`,`item_id`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `email_tagged` varchar(20) NOT NULL,
  `email_tagger` varchar(20) NOT NULL,
  `item_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `tagtime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email_tagged`,`email_tagger`,`item_id`),
  KEY `email_tagger` (`email_tagger`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;