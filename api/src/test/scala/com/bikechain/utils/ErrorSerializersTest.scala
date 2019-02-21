package com.bikechain.utils

import org.scalatest.{FlatSpec, Matchers}

class ErrorSerializersTest extends FlatSpec with Matchers {
  it should "Generate a 404 error" in {
    val notFoundError = ErrorSerializers.toNotFoundError("device", "id", "1234")
    notFoundError.code shouldBe 404
  }

  it should "Generate a 422 error" in {
    val error = ErrorSerializers.toInvalidParamError("param", "value")
    error.code shouldBe 422
  }
}
