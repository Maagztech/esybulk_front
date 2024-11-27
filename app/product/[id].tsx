import ProductDetails from "@/components/mobileview/global/ProductDetails";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";

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
    <ScrollView>
      <ProductDetails id={id} />
    </ScrollView>
  );
};

export default ProductPage;
