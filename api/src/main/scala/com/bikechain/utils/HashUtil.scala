package com.bikechain.utils

import java.security.MessageDigest

object HashUtil {
  private lazy val random =
    new scala.util.Random(new java.security.SecureRandom())
  private def sha1 = MessageDigest.getInstance("SHA-1")

  private def randomString(alphabet: String)(n: Int): String =
    Stream
      .continually(random.nextInt(alphabet.size))
      .map(alphabet)
      .take(n)
      .mkString

  def randomAlphanumericString(n: Int) =
    randomString("abcdefghijklmnopqrstuvwxyz0123456789")(n)

  def saltAndHash(password: String, salt: String) = {
    sha1.digest((password + salt).getBytes).map("%02x".format(_)).mkString
  }
}
