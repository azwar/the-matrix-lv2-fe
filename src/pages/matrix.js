import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { findCoordinate } from "@/services/MatrixService";
import BaseLayout from "@/components/BaseLayout";
import { getSession, signOut } from "next-auth/react";
import nookies from 'nookies';

function Matrix({ user }) {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    id: Yup.string().required("ID is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [errMessage, setErrMessage] = useState('');
  const [blockChainAddress, setBlockChainAddress] = useState('');
  const [result, setResult] = useState();

  useEffect(() => {
  }, [])

  useEffect(() => {
    setBlockChainAddress(user?.address);
  }, [user])

  function onSubmit({ id }) {
    setResult(null);

    findCoordinate(id)
      .then((res) => {
        if (res === false) {
          setErrMessage("Coordinate with given ID can not be found");
          return;
        }

        setResult(res);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err);
        setErrMessage(err.response?.data?.message);
      });
  }

  function hadnleSignout() {
    if (user) {
      // logout from blockchain
      // rediret to login page after logout success
      signOut({ redirect: '/login' });
    } else {
      // logout from jwt
      router.push('/logout')
    }
  }

  return (
    <BaseLayout>
      {/* <SimpleAuthorizer/> */}
      <div className="flex space-x-4 justify-end">
        <div onClick={hadnleSignout} className="cursor-pointer" >
          <svg
            className="w-6 h-6 text-purple-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
            ></path>
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
        Matrix Lv 2
      </h1>
      <div className="my-4 inline-flex text-sm text-purple-700">
        Connected to: {blockChainAddress || 'jwt-authentication'}
      </div>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800"
          >
            Enter ID of location to find the coordinate
          </label>
          <input
            type="text"
            name="id"
            {...register("id")}
            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          <div className="inline-flex text-sm text-red-700">
            {errors.id?.message}
          </div>
        </div>
        <div className="my-4 inline-flex text-sm text-red-700">
          {errMessage}
        </div>
        <div className="my-4 inline-flex text-sm text-">
          {result ? (
            <table className="table-auto">
              <tbody className="">
                <tr className="border border-indigo-900 border-b bg-indigo-100">
                  <td className="px-2 border-gray-400 border-r border-b">
                    Database row index
                  </td>
                  <td className="p-2 border-gray-400 border-b">
                    {result.dbrow}
                  </td>
                </tr>
                <tr className="border border-indigo-900 bg-cyan-100">
                  <td className="px-2 border-gray-400 border-r">Coordinate</td>
                  <td className="p-2">{`[${result.coordinate}]`}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <></>
          )}
        </div>
        <div className="mt-6">
          <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
            Find
          </button>
        </div>
      </form>
    </BaseLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  nookies.set(context, 'token', session.user.access_token || '', {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  nookies.set(context, 'user', JSON.stringify(session.user), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  return {
    props: { user: session.user },
  };
}

export default Matrix;