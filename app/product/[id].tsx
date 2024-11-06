import ProductDetails from "@/components/mobileview/shopkeeper/components/productDetails";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

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
      {/* <h1>Product ID: {id}</h1> */}
      <ProductDetails id={id} />
    </div>
  );
};

export default ProductPage;
