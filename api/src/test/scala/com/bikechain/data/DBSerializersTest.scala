package com.bikechain.data.utils

import org.scalatest.{FlatSpec, Matchers}
import scala.util.{Success, Failure}
import com.bikechain.models.{Error}
import org.postgresql.util.PSQLException

class DBSerializersTest extends FlatSpec with Matchers {
  it should "Serialize a valid result" in {
    val result = DBSerializers.toResult[Int, Int](i => Some(1))(Success(1))
    result.right.get shouldBe 1
  }

  it should "Serialize a not found result from successful try" in {
    val result = DBSerializers.toResult[Int, Int](i => None)(Success(1))
    result.left.get shouldBe a[Error]
    result.left.get.code shouldBe 404
  }

  it should "Serialize an error from failed try" in {
    val result = DBSerializers.toResult[Int, Int](i => None)(
      Failure(new PSQLException("Failed", null))
    )
    result.left.get shouldBe a[Error]
    result.left.get.code shouldBe 500
  }

  it should "Serialize an error from Exception" in {
    val result = DBSerializers.toResult[Int, Int](i => None)(
      Failure(new Exception("Failed"))
    )
    result.left.get shouldBe a[Error]
    result.left.get.code shouldBe 500
  }
}
