package com.bikechain.utils

object EmailUtil {
  def isValid(email: String) =
    if ("""(?=[^\s]+)(?=(\w+)@([\w\.]+))""".r.findFirstIn(email) == None) false
    else true
}
