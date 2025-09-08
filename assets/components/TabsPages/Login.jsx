// App.js

import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    
} from "react-native";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle login/register
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = () => {
        if (!email || !password || (!isLogin && !name)) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        if (isLogin) {
            // 🔐 Mock login
            Alert.alert("Login Success", `Welcome back, ${email}`);
        } else {
            // 📝 Mock register
            Alert.alert("Register Success", `Account created for ${name}`);
            setIsLogin(true); // Go back to login after registration
        }

        // Clear fields
        setName("");
        setEmail("");
        setPassword("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

            {!isLogin && (
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            )}

            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>
                    {isLogin ? "Login" : "Register"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setIsLogin(!isLogin);
                    setName("");
                    setEmail("");
                    setPassword("");
                }}
            >
                <Text style={styles.switchText}>
                    {isLogin
                        ? "Don't have an account? Register"
                        : "Already have an account? Login"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#333",
    },
    input: {
        height: 50,
        backgroundColor: "#fff",
        marginBottom: 16,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    switchText: {
        textAlign: "center",
        color: "#007bff",
        fontSize: 14,
    },
});
