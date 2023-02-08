import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { login } from "@/services/UserService";
import BaseLayout from "@/components/BaseLayout";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { InjectedConnector } from "wagmi/connectors/injected";
import { signIn } from "next-auth/react";
import { getCsrfToken } from "next-auth/react";

export default function Login({ csrfToken }) {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [errMessage, setErrMessage] = useState("");

  // for Metamask connect
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  function onSubmit({ username, password }) {
    setErrMessage('')

    // "username-login" matches the id for the credential
    return signIn("username-login", {
      username,
      password,
      redirect: false,
    })
    .then(({ ok, error }) => {
      if (ok) {
        router.push("/matrix");
      } else {
        setErrMessage(error)
      }
    });
  }

  async function connectMetamask() {
    if (isConnected) {
      await disconnectAsync();
    }
    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });
    // redirect user after success authentication to '/user' page
    const res = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/matrix",
    });

    if (res.status === 200) {
      localStorage.setItem("address", account);
      push(res.url);
    }
  }

  return (
    <BaseLayout>
      <h1
        className="text-3xl font-semibold text-center text-purple-700 uppercase"
      >
        Sign in
      </h1>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800"
          >
            Username
          </label>
          <input
            type="email"
            name="username"
            {...register("username")}
            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          <div className="inline-flex text-sm text-red-700">
            {errors.username?.message}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            {...register("password")}
            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          <div className="inline-flex text-sm text-red-700">
            {errors.password?.message}
          </div>
        </div>
        <div className="my-4 inline-flex text-sm text-red-700">
          {errMessage}
        </div>
        <div className="mt-6">
          <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
            Login
          </button>
          <p className="text-center p-4">or</p>
        </div>
      </form>
      <div className="flex-col">
        <button
          className="flex justify-center w-full px-4 py-2 tracking-wide text-gray-800 transition-colors duration-200 transform bg-gray-100 rounded-md border border-purple-700"
          onClick={connectMetamask}
        >
          <Image
            src="/images/metamask-logo.png"
            alt="Metamask Logo"
            width={27}
            height={27}
            priority
          />
          <span className="ml-4">Login with Metamask</span>
        </button>
      </div>
      <p className="mt-8 text-xs font-light text-center text-gray-700">
        {`Don't have an account? You need grant access invitation`}
      </p>
    </BaseLayout>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return { props: { csrfToken } };
}
