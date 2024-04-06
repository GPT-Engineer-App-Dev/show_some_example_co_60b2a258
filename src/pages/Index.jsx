import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const exampleHexCodes = ["#FF5733", "#33FF57", "#3357FF"];

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colors, setColors] = useState([]);
  const toast = useToast();

  useEffect(() => {
    exampleHexCodes.forEach((hex) => {
      fetchColorName(hex);
    });
  }, []);

  const fetchColorName = async (hex) => {
    setHexCode(hex);
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      setColors((prevColors) => [
        ...prevColors,
        {
          hex: hex,
          name: data.colors[0] ? data.colors[0].name : "Color name not found",
          swatchSvg: data.colors[0] && data.colors[0].swatchImg ? data.colors[0].swatchImg.svg : null,
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {colors.map((color, index) => (
        <Box key={index} mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {color.name}
          </Text>
          {color.swatchSvg && <Box mt={2} dangerouslySetInnerHTML={{ __html: color.swatchSvg }} />}
        </Box>
      ))}
    </Box>
  );
};

export default Index;
