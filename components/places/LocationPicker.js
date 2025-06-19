import { Alert, View, StyleSheet, Image } from "react-native";
import OutlineButton from "../ui/OutlineButton";
import { Colors } from "../../constants/colors";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import { useState } from "react";
import { getMapPreview } from "../../util/location";
import { useNavigation } from '@react-navigation/native';

function LocationPicker() {

    const navigation = useNavigation();
    const [pickedLocation, setPickedLocation] = useState()
    const [locationPermissionInformation, requirePermission] = useForegroundPermissions()

    async function verifyPermissions() {
        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission()
            return permissionResponse.granted
        }

        if (locationPermissionInformation.status == PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permission',
                'You need to grant location permission to use this app'
            )
            return false
        }

        return true
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions()
        if (!hasPermission) {
            return
        }
        const location = await getCurrentPositionAsync()
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        })
    }

    function pickOnMapHandler() {
        navigation.navigate('Map');
    }

    let locationPreview = <Text>No location picked yet</Text>
    if (pickedLocation) {
        locationPreview = <Image
            style={styles.image}
            source={{
                uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)
            }}
        />
    }

    return (
        <View>
            <View style={styles.mapPreview}></View>
            {locationPreview}
            <View style={styles.actions}>
                <OutlineButton icon="location" onPress={getLocationHandler}>Locate User</OutlineButton>
                <OutlineButton icon="map" onPress={pickOnMapHandler}>Pick On Map</OutlineButton>
            </View>
        </View>
    )
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
})