import type { NextPage } from "next";

import { Container, Heading } from "@chakra-ui/react";
import { Box, Center, Image, Text, Link, Spinner } from "@chakra-ui/react";

import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

import { MarkGithubIcon } from "@primer/octicons-react";
interface WeatherList {
  description: string;
  icon: string;
  id: number;
  main: string;
}
interface WeatherInfo {
  base: string;
  clouds: object;
  cod: number;
  coord: object;
  dt: number;
  id: number;
  main: object;
  name: string;
  sys: object;
  timezone: number;
  visibility: number;
  weather: WeatherList[];
  wind: Object;
}

const Home: NextPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API;
  const getWeathers = async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=1850147&lang=ja&appid=${apiKey}`
    );
    return data;
  };

  const useWeathers = () => {
    return useQuery<WeatherInfo, AxiosError>(["weatherInfo"], getWeathers);
  };
  const { data, isError, isLoading, isSuccess } = useWeathers();

  const renderResult = () => {
    if (isLoading) {
      return (
        <Container textAlign="center">
          <Spinner size="xs" />
          <Text fontSize="xs">読込中</Text>
        </Container>
      );
    }
    if (isError) {
      return (
        <Text textAlign="center">
          なにかがうまくいかないみたいです。
          <br />
          お手数ですが、リロードしてみてください。
        </Text>
      );
    }
    if (isSuccess) {
      const name = data.name;
      const currentWeather = data.weather[0].description;
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const weatherAlt = `現在の${name}の天気は${currentWeather}です`;
      return (
        <Box
          pt="16"
          px="4"
          pb="4"
          maxW="320px"
          borderWidth="1px"
          textAlign="center"
        >
          <Heading size="xs" mb="2">
            現在の{name}のお天気
          </Heading>
          <Image
            src={weatherIcon}
            alt={weatherAlt}
            htmlWidth="50px"
            mx="auto"
          />
          <Text fontSize="xs">{currentWeather}</Text>
          <Container borderTop="1px" borderTopColor="#eee" pt="4" mt="14">
            <Text fontSize="xs">This is a TypeScript practice project.</Text>
            <Link
              href="https://github.com/webiroha/simple-weather-app"
              isExternal
              fontSize="xs"
            >
              <MarkGithubIcon size="small" aria-label="GitHub" fill="#1a202c" />
            </Link>
          </Container>
        </Box>
      );
    }
    return <></>;
  };
  return <Center h="100vh">{renderResult()}</Center>;
};

export default Home;
