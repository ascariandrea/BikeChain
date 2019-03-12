package com.bikechain.models

import io.circe.generic.JsonCodec
import io.circe.syntax._

@JsonCodec case class Error(
    val message: String,
    val code: Int = 500
)
