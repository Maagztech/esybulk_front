import { useAuth } from "@/context/authContext";
import { useCompany } from "@/context/companyContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import StarRating, { StarRatingDisplay } from "react-native-star-rating-widget";
import Toast from "react-native-toast-message";
import RadioButton from "../shopkeeper/components/RadioButton";
import BuyNowConfirmModal from "./BuyNowConfirmModal";
import BuySellButton from "./BuySellButton";
import LabeledInput from "./LabeledMultilineInput";
import AddProductModal from "./ProductAddModal";
export default function ProductDetails({ id }: { id: string }) {
  const { setSelectedProduct }: any = useCompany();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formatTime = (utcString: string) => {
    const time = moment(utcString);
    const now = moment();

    if (now.diff(time, "seconds") < 60) return "moments ago";
    if (now.diff(time, "days") < 1) return time.fromNow();

    return time.format("MMMM Do YYYY, h:mm a"); // e.g., "November 27th 2024, 2:45 pm"
  };
  const { userInfo, access_token }: any = useAuth();
  type ProductDetailsType = {
    images: string[];
    title: string;
    mrp: number;
    about: string;
    rating: number;
    totalRating: number;
    proporties: { _id: string; question: string; answer: string }[];
  };
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  type BuyOptionType = {
    companyName: string;
    companyUserId: string;
    price: { quantity: number; price: number }[];
  };

  type SellOptionType = {
    quantity: number;
    price: number;
  };

  const [sellOptions, setSellOptions] = useState<SellOptionType[]>([]);
  type combinedBuyOptionsType = {
    companyName: string;
    companyUserId: string;
    quantity: number;
    price: number;
  };
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [buyOptions, setBuyOptions] = useState<BuyOptionType[]>([]);
  const [combinedBuyOptions, setCombinedBuyOptions] = useState<
    combinedBuyOptionsType[]
  >([]);
  useEffect(() => {
    if (access_token) fetchProductDetails();
  }, [id, access_token]);

  const fetchProductDetails = async () => {
    try {
      let response;
      if (userInfo?.role === "distributor") {
        response = await axios.get(
          `https://api.esybulk.store/api/distributor/buyoptions?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      } else if (userInfo?.role === "shopkeeper") {
        response = await axios.get(
          `https://api.esybulk.store/api/distributor/buyoptionsshopkeeper?product=${id}`,
          { headers: { Authorization: `${access_token}` } }
        );
      } else {
        response = await axios.get(
          "https://api.esybulk.store/api/companygetProductDetails?product=" +
          id,
          { headers: { Authorization: `${access_token}` } }
        );
        setSellOptions(response.data.sellOptions);
        setTotalAvailable(response.data.totalAvailable);
      }
      setProductDetails(response.data.product);
      setBuyOptions(response.data.buyOptions);
    } catch (error) {
      console.log("error", error);
    }
  };
  const [simmilarProducts, setSimmilarProducts]: any = useState([]);
  const [confinedSimmilarProducts, setConfinedSimmilarProducts] = useState([]);
  useEffect(() => {
    setConfinedSimmilarProducts(
      simmilarProducts.filter((product: any) => product._id !== id)
    );
  }, [simmilarProducts]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadSimmilarProducts = async () => {
      if (productDetails) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.esybulk.store/api/search?search=${productDetails?.title}&page=1`,
            {
              headers: { Authorization: `${access_token}` },
            }
          );
          setSimmilarProducts(response.data.products);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    };
    loadSimmilarProducts();
  }, [productDetails]);
  type SelectedOption = {
    quantity: number;
    price: number;
    order_from: string;
    product: string;
  } | null;

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);

  const handleSelectOption = (option: any) => setSelectedOption(option);

  const [confirmModal, setConfirmModal] = useState(false);

  const handleBuyNow = () => {
    try {
      const reponse = axios.post(
        `https://api.esybulk.store/api/shopkeeperorder`,
        selectedOption,
        { headers: { Authorization: `${access_token}` } }
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order placed successfully",
      });
      setConfirmModal(false);
      router.push("/orders");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order.",
      });
    }
  };

  useEffect(() => {
    if (buyOptions) {
      const aggregatedOptions = buyOptions
        .flatMap((option) =>
          option.price.map((priceOption) => ({
            companyUserId: option.companyUserId,
            companyName: option.companyName,
            quantity: priceOption.quantity,
            price: priceOption.price * priceOption.quantity,
          }))
        )
        .sort((a, b) =>
          a.quantity === b.quantity ? a.price - b.price : a.quantity - b.quantity
        );

      setCombinedBuyOptions(aggregatedOptions);
    }
  }, [buyOptions]);
  const [ratingAddLoading, setRatingAddLoading] = useState(false);
  const [ratingAdded, setRatingAdded] = useState(false);

  const [showMoreAbout, setShowMoreAbout] = useState(false);
  const maxLines = 3; // Number of lines to show when collapsed

  const toggleShowMore = () => {
    setShowMoreAbout(!showMoreAbout);
  };
  type CommentType = {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    author: {
      name: string;
      companyName: string;
      avatar: string;
    };
  };

  useEffect(() => {
    const addHistory = async () => {
      try {
        await axios.post(
          `https://api.esybulk.store/api/saveHistory`,
          { product: id },
          { headers: { Authorization: `${access_token}` } }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (id) addHistory();
  }, [id]);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const loadComments = async () => {
    try {
      if (currentPage >= totalPages) return;
      const response = await axios.get(
        `https://api.esybulk.store/api/getRating/${id}?&page=${currentPage + 1
        }`
      );
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setComments((prev) => [...prev, ...response.data.ratings]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadComments();
  }, [id]);

  const handelAddRating = async () => {
    try {
      setRatingAddLoading(true);
      const response = await axios.post(
        `https://api.esybulk.store/api/addRating`,
        {
          product: id,
          rating: rating,
          review: review,
        },
        { headers: { Authorization: `${access_token}` } }
      );
      setRatingAddLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Rating added successfully",
      });
      setRating(0);
      setReview("");
      setRatingAdded(true);
      setTimeout(() => {
        setRatingAdded(false);
      }, 2000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add rating.",
      });
    }
  };
  if (!productDetails || !buyOptions)
    return <ActivityIndicator size="small" color="#0000ff" />;
  return (
    <View style={styles.container}>
      <FlatList
        data={productDetails?.images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", gap: 7, alignItems: "center" }}>
          <StarRatingDisplay
            rating={productDetails.rating}
            starSize={30}
            color="#966440"
          />
          <Text style={{ fontSize: 16, color: "#966440", fontWeight: "bold" }}>
            {productDetails.rating}
            <Text style={{ color: "black", fontSize: 10 }}>
              {" "}
              {productDetails.totalRating} Ratings
            </Text>
          </Text>
        </View>
        <Text style={styles.productName}>{productDetails?.title}</Text>
        <Text style={styles.productPrice}>MRP: {productDetails?.mrp} ₹</Text>
        <Text
          style={styles.productDescription}
          numberOfLines={showMoreAbout ? undefined : maxLines}
          ellipsizeMode="tail"
        >
          {productDetails?.about}
        </Text>
        <Pressable onPress={toggleShowMore}>
          <Text style={styles.showMoreButton}>
            {showMoreAbout ? "Show Less" : "Show More"}
          </Text>
        </Pressable>

        <Text style={styles.buyOptions}>Product Proporties</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Question</Text>
            <Text style={styles.tableHeaderText}>Answer</Text>
          </View>
          <FlatList
            data={productDetails.proporties}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.question}</Text>
                <Text style={styles.tableCell}>{item.answer}</Text>
              </View>
            )}
          />
        </View>
        {userInfo?.role === "company" && (
          <>
            <Text style={styles.buyOptions}>Sell Options</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Quantity</Text>
                <Text style={styles.tableHeaderText}>Price (₹)</Text>
              </View>
              <FlatList
                data={sellOptions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>{item.price}</Text>
                  </View>
                )}
              />
            </View>
            <AddProductModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setLoading={setLoading}
            />
          </>
        )}
        {userInfo?.role !== "company" && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <View>
                <Text style={[styles.address, { maxWidth: "65%" }]}>
                  Your Address:
                </Text>
                <Text
                  style={[
                    styles.address,
                    { marginBottom: 10, maxWidth: "65%", color: "#966440" },
                  ]}
                >
                  {userInfo?.street}, {userInfo?.village_city},{" "}
                  {userInfo?.district}, {userInfo?.state} - {userInfo?.pinCode}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  router.push("/profile");
                }}
              >
                <Text
                  style={{ color: "#966440", fontSize: 16, fontWeight: "bold" }}
                >
                  Change Address
                </Text>
              </Pressable>
            </View>

            <Text style={styles.buyOptions}>Buy Options</Text>
            {combinedBuyOptions.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Quantity</Text>
                  <Text style={styles.tableHeaderText}>Price / item</Text>
                  <Text style={styles.tableHeaderText}>Price</Text>
                  <Text style={styles.tableHeaderText}>Profit</Text>
                  {userInfo?.role != "company" && (
                    <Text style={styles.tableHeaderText}>Select</Text>
                  )}
                </View>
                {combinedBuyOptions.map((option, index) =>
                  <View key={`${index}`} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{option?.quantity}</Text>
                    <Text style={styles.tableCell}>
                      ₹
                      {(option?.price / option?.quantity)
                        .toFixed(2)
                        .replace(/\.00$/, "")}
                    </Text>
                    <Text style={styles.tableCell}>₹{option?.price}</Text>
                    <Text style={styles.tableCell}>
                      ₹
                      {(productDetails?.mrp ?? 0) * option?.quantity -
                        option.price}
                    </Text>

                    <View style={styles.tableCell}>
                      <RadioButton
                        selected={
                          selectedOption?.order_from ===
                          option.companyUserId &&
                          selectedOption?.quantity === option.quantity
                        }
                        onPress={() =>
                          handleSelectOption({
                            order_from: option.companyUserId,
                            product: id,
                            quantity: option.quantity,
                          })
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text style={{ fontSize: 14, textAlign: "center" }}>
                No buy options available in your region.
              </Text>
            )}
          </>
        )}
      </View>
      {userInfo?.role !== "company" ? (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              selectedOption ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            onPress={() => setConfirmModal(true)}
            disabled={!selectedOption}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.buttonEnabled]}
            onPress={() => {
              console.log(sellOptions);
              setSelectedProduct({
                ...productDetails,
                buyOptions: sellOptions,
                quantity: totalAvailable,
              });
              setIsOpen(true);
            }}
          >
            <Text style={styles.buttonText}>Edit Product</Text>
          </Pressable>
        </View>
      )}
      <BuyNowConfirmModal
        visible={confirmModal}
        onConfirm={handleBuyNow}
        onCancel={() => setConfirmModal(false)}
        text1="Confirm Purchase"
        text2="Are you sure you want to buy this item?"
      />
      {userInfo?.role !== "company" && (
        <View
          style={{
            backgroundColor: "white",
            marginVertical: 10,
            borderRadius: 10,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            position: "relative",
          }}
        >
          {(ratingAddLoading || ratingAdded) && (
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "white",
                opacity: 0.8,
                zIndex: 1,
                borderRadius: 10,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {ratingAddLoading && (
                <ActivityIndicator size="small" color="green" />
              )}
              {ratingAdded && (
                <>
                  <Ionicons name="checkmark-circle" size={30} color="green" />
                  <Text
                    style={{
                      color: "green",
                      fontSize: 20,
                      marginVertical: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Rating Added Successfully
                  </Text>
                </>
              )}
            </View>
          )}
          <Text
            style={{
              fontSize: 14,
              color: "#333",
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Rate this product
          </Text>
          <StarRating
            rating={rating}
            onChange={setRating}
            color="#966440"
            starSize={55}
            style={{ marginBottom: 20 }}
          />
          {rating > 0 && (
            <>
              <LabeledInput
                label="Add a review"
                value={review}
                onChangeText={setReview}
                placeholder="Write your review here"
              />
              <Pressable
                style={[styles.button, styles.buttonEnabled, { width: "100%" }]}
                disabled={ratingAddLoading}
                onPress={() => {
                  handelAddRating();
                }}
              >
                <Text style={styles.buttonText}>Add Rating</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
      {comments.length > 0 && (
        <>
          <ScrollView
            contentContainerStyle={{
              marginVertical: 3,
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {comments.map((comment) => (
              <View
                style={{
                  marginVertical: 10,
                  width: "100%",
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Image
                    source={{ uri: comment.author.avatar }}
                    style={{ width: 35, height: 35, borderRadius: 17.5 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.distributorName}>
                      {comment.author.name}
                    </Text>
                    <Text style={{ color: "#333", fontSize: 10 }}>
                      {comment.author.companyName}
                    </Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      backgroundColor: "gray",
                      padding: 5,
                      borderRadius: 5,
                      alignSelf: "flex-start",
                      marginVertical: 5, // Makes the View take only the Text's width
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {formatTime(comment.createdAt)}
                    </Text>
                  </View>

                  <StarRatingDisplay
                    rating={comment.rating}
                    starSize={20}
                    color="#966440"
                    style={{ marginLeft: -5 }}
                  />
                  <Text
                    style={{ fontSize: 14, color: "#333", marginVertical: 5 }}
                  >
                    {comment.review}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {currentPage < totalPages && (
            <Pressable onPress={() => loadComments()}>
              <Text style={styles.showMoreButton}>View More</Text>
            </Pressable>
          )}
        </>
      )}
      {userInfo?.role !== "company" && (
        <FlatList
          data={confinedSimmilarProducts}
          keyExtractor={(item: { _id: string }) => item._id}
          renderItem={({ item }) => <BuySellButton item={item} />}
          ListFooterComponent={
            <>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              ) : null}
            </>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  loadingContainer: { paddingVertical: 10, alignItems: "center" },
  flatListContainer: {
    paddingVertical: 10,
  },
  productImage: {
    width: 300,
    height: 300,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 20,
    color: "#B12704",
    marginVertical: 5,
  },
  address: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  showMoreButton: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  buyOptions: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  distributorSection: {
    marginVertical: 10,
    marginLeft: 20,
  },
  distributorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
  },
  buttonEnabled: {
    backgroundColor: "#966440",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
