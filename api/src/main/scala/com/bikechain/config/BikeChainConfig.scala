package com.bikechain.config
import com.typesafe.config.ConfigFactory

trait BikeChainConfig {
  lazy val bikeChainConfig = ConfigFactory.load("com/bikechain")
}
