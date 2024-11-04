import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { Button } from "react-native";

type RouteParams = {
  params: {
    id: string;
  };
};

const ProductPage = () => {
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const navigation = useNavigation();
  return (
    <div>
      <h1>Product ID: {id}</h1>

      <Button title="Go to Home" onPress={() => router.push("/home")} />
    </div>
  );
};

export default ProductPage;
