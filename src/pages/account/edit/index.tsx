import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../../components/Header";
import { prisma } from "../../../lib/prisma";

import { Input } from "../../../components/Form/Input";
import { useEffect } from "react";

import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useUser } from "../../../hooks/useUsers";

import { getSession, signOut } from "next-auth/react";

import { useRouter } from "next/router";

import Head from "next/head";

interface UpdateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function AccountEdit({ session }) {
  const router = useRouter();

  const id = session?.user?.id;

  const { data } = useUser(id);

  const updateUserFormSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    password_confirmation: yup
      .string()
      .oneOf([null, yup.ref("password")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserData>({
    resolver: yupResolver(updateUserFormSchema),
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email);
    }
  }, [data]);

  const handleUpdateUser = async (values) => {
    try {
      const response = await fetch(`/api/users/update?id=${id}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data) {
        toast.success("User updated successfully!");
      }

      router.push("/");
      signOut();
    } catch (error) {
      toast.error("Error updating user!");
    }
  };

  return (
    <>
      <Head>
        <title>My Account</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" h="100vh">
        <ToastContainer position="bottom-center" />

        <Header />
        <Flex
          w="100%"
          my="6"
          maxWidth={1480}
          mx="auto"
          px={["4", "6"]}
          onSubmit={handleSubmit(
            async (values) => await handleUpdateUser(values)
          )}
        >
          <Box as="form" flex="1" borderRadius="8" bg="gray.800" p={["6", "8"]}>
            <Heading size="lg" fontWeight="normal">
              My Account
            </Heading>

            <Divider my="6" borderColor="gray.700" />

            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  label="Full Name"
                  error={errors.name}
                  {...register("name")}
                />
                <Input
                  type="email"
                  label="E-mail"
                  error={errors.email}
                  {...register("email")}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                <Input
                  type="password"
                  label="Password"
                  error={errors.password}
                  {...register("password")}
                />
                <Input
                  type="password"
                  label="Password Confirmation"
                  error={errors.password_confirmation}
                  {...register("password_confirmation")}
                />
              </SimpleGrid>
            </VStack>

            <HStack spacing="8" mt="8">
              <Flex gap={8}>
                <Button as="a" colorScheme="whiteAlpha" href="/admin/products">
                  Cancel
                </Button>
                <Button type="submit" colorScheme="pink">
                  Save
                </Button>
              </Flex>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
