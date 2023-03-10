import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useState } from "react";

import { RiAddLine, RiRefreshLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useUsers } from "../../../hooks/useUsers";

import Head from "next/head";

interface Users {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserList() {
  const { data, isLoading, isFetching, refetch, error } = useUsers();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handleSelectedUsers() {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    await fetch("/api/users/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: selectedUsers }),
    });

    refetch();
  }

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleSelectUser = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    }
  };

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Header />

        <ToastContainer position="bottom-center" />

        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />

          <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
            <Flex mb="8" justify="space-between" align="center">
              <Flex
                direction={isWideVersion ? "row" : "column"}
                align="center"
                gap="8"
              >
                <Heading size="lg" fontWeight="normal">
                  Users
                  {!isLoading && isFetching && (
                    <Spinner size="sm" color="gray.500" ml="4" />
                  )}
                </Heading>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="purple"
                  leftIcon={<Icon as={RiRefreshLine} fontSize="20" />}
                  onClick={() => refetch()}
                >
                  Refresh
                </Button>
              </Flex>

              <Flex
                direction={isWideVersion ? "row" : "column"}
                align="center"
                gap="8"
              >
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  href="/admin/users/create"
                >
                  Create new Admin User
                </Button>
              </Flex>
            </Flex>

            {isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex justify="center">
                <Text>Failed to Fetch Data</Text>
              </Flex>
            ) : (
              <>
                <Table colorScheme="whiteAlpha">
                  <Thead>
                    <Tr>
                      <Th px={["4", "4", "6"]} color="gray.300" width="8">
                        <Text>ID</Text>
                      </Th>
                      <Th>UserName</Th>
                      {isWideVersion && <Th>E-mail</Th>}
                      <Th w="8">Create At</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {data?.map((user: Users) => (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Text>{user.id}</Text>
                        </Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold" color="purple.400">
                              {user.name}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{user.email}</Td>}
                        <Td>
                          <Box>
                            <Text fontWeight="bold" color="purple.400">
                              {new Date(user.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </Text>
                          </Box>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}
