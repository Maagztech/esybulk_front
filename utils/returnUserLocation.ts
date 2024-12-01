import * as Location from 'expo-location';

export async function getCurrentLocation() {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    });
    return reverseGeocode;
}