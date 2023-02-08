import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { login } from "@/services/UserService";
import { findCoordinate } from "@/services/MatrixService";
import BaseLayout from "@/components/BaseLayout";

export default function SimpleAuthorizer() {
  const router = useRouter();

  useEffect(() => {
    const tokenExist = localStorage.getItem("token") ? true : false;
    const web3AddressExist = localStorage.getItem("address") ? true : false;

    if (!tokenExist && !web3AddressExist) {
      router.push("/login");
    }
  }, []);

  return (
    <div>
    </div>
  );
}
