import {
  Box,
  Button,
  Checkbox,
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
import Link from "next/link";

import { RiAddLine, RiAccountPinBoxLine, RiRefreshLine } from "react-icons/ri";

import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useProducts } from "../../../hooks/useProducts";

import Head from "next/head";

interface Products {
  id: number;
  name: string;
  price: number;
  description: string;
  createdAt: string;
}

export default function ProductList() {
  const { data, isLoading, isFetching, refetch, error } = useProducts();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

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
                  Products
                  {!isLoading && isFetching && (
                    <Spinner size="sm" color="gray.500" ml="4" />
                  )}
                </Heading>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="pink"
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
                  bg="pink.900"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                  href="/admin/products/create"
                >
                  Create new Product
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
                      <Th px={["4", "4", "6"]} color="gray.300" width="8"></Th>
                      <Th>ID</Th>
                      {isWideVersion && <Th>Name</Th>}
                      <Th>Price</Th>
                      <Th w="8"></Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {data?.map((product: Products) => (
                      <Tr key={product.id}>
                        <Td px={["4", "4", "6"]}></Td>
                        <Td>
                          <Box>
                            <Text fontWeight="bold" color="purple.400">
                              {product.id}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{product.name}</Td>}
                        {isWideVersion && (
                          <Td>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(product.price)}
                          </Td>
                        )}
                        <Td>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button
                              size="sm"
                              fontSize="sm"
                              bg="pink.700"
                              leftIcon={
                                <Icon as={RiAccountPinBoxLine} fontSize="16" />
                              }
                              cursor="pointer"
                            >
                              {isWideVersion ? "Edit" : ""}
                            </Button>
                          </Link>
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
