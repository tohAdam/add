import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <Text style={{ marginRight: 10, fontWeight: "bold" }}>
              Pingay Adamusa U.
            </Text>
          )
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="AddUser" component={AddUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//////////////////// LOGIN ////////////////////
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const defaultEmail = "mobile@uc.com";
  const defaultPassword = "hello123!";

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (email === defaultEmail && password === defaultPassword) {
      Alert.alert("Success", "Login Successful!");
      navigation.navigate("Users");
    } else {
      Alert.alert("Error", "Invalid Credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// USERS ////////////////////
function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadUsers);
    return unsubscribe;
  }, [navigation]);

  const loadUsers = async () => {
    const data = await AsyncStorage.getItem("users");
    if (data) setUsers(JSON.parse(data));
    else setUsers([]);
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>

        <TouchableOpacity onPress={() => navigation.navigate("AddUser")}>
          <Text style={styles.add}>ADD</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search"
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

//////////////////// ADD USER ////////////////////
function AddUserScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const saveUser = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const existing = await AsyncStorage.getItem("users");
    let users = existing ? JSON.parse(existing) : [];

    const duplicate = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (duplicate) {
      Alert.alert("Error", "Email already exists");
      return;
    }

    users.push({ email });

    await AsyncStorage.setItem("users", JSON.stringify(users));

    Alert.alert("Success", "User Saved!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New User</Text>

      <Text>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={saveUser}>
        <Text style={styles.btnText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}

//////////////////// STYLES ////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12
  },
  button: {
    backgroundColor: "pink",
    padding: 15,
    alignItems: "center"
  },
  btnText: {
    color: "#fff"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  add: {
    color: "blue"
  },
  card: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 5
  }
});