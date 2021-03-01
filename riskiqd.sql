drop table if exists property;
CREATE TABLE property
(
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  uuid varchar(50) NOT NULL,
  date date,
  risk float unsigned,
  iqd float unsigned,
  isPred boolean,
  CONSTRAINT pk_property PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;