import ProductDetails from "@/components/mobileview/global/ProductDetails";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

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
      <Toast />
    </ScrollView>
  );
};

export default ProductPage;
