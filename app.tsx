import React, { useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TextInput,
    ScrollView,
    FlatList,
    Image,
    Modal,
    Platform,
    Alert,
    ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';


type MockGradientProps = {
    children?: React.ReactNode;
    style?: any; 
    colors: string[];
};



const LinearGradient = ({ children, style, colors }: MockGradientProps) => <View style={[style, { backgroundColor: colors[0] }]} children={children} />;

// ----- Types -----
type RootStackParamList = {
    Welcome: undefined;
    SignInSignUp: undefined;
    Menu: undefined; // User view
    EditMenu: undefined; // Chef view
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ----- App-level -----
type AppState = {
    role: 'User' | 'Chef' | null;
    setRole: (r: 'User' | 'Chef' | null) => void;
    menuItems: MenuItem[];
    setMenuItems: (items: MenuItem[]) => void;
};

type MenuItem = {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string; // breakfast|lunch|dinner|snacks|dessert|drinks|vegetarian
    imageUri?: ImageSourcePropType | string | null;
};

const AppContext = createContext<AppState | undefined>(undefined);

const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppContext');
    return ctx;
};

// ----- Helper values -----
const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks','vegetarian', 'dessert', 'drinks'];
const { width } = Dimensions.get('window');

// ----- Main App -----
export default function App() {
    const [role, setRole] = useState<'User' | 'Chef' | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([

    { 
            id: '1', 
            name: 'Crispy Pancakes', 
            description: 'Two stacks of delicious, golden-brown pancakes with maple syrup.', 
            price: 45, 
            category: 'breakfast', 
            imageUri: require('./assets/pancake.jpg'), 
        },       
        { 
            id: '2', 
            name: 'Avocado on Toast', 
            description: 'A fresh twist on a classic favorite. Creamy smashed avocado spread over lightly toasted artisan bread, topped with a drizzle of olive oil, a sprinkle of chili flakes, and a hint of lemon zest for a zesty finish.', 
            price: 45, 
            category: 'breakfast', 
            imageUri: require('./assets/avocado.jpg'), 
        },
        { id: '3', 
            name: 'Caesar Salad',
             description: 'Crisp romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.',
              price: 75, 
              category: 'lunch',
               imageUri: require('./assets/caesarsalad.jpg'),
            },

        { id: '4',
             name: 'Grilled Salmon',
              description: 'Perfectly grilled salmon fillet with lemon butter sauce.',
               price: 150, 
               category: 'dinner',
                imageUri: require('./assets/grilledsalmon.jpg'),
             },

        { id: '5',
             name: 'Chocolate Cake', 
             description: 'Rich, moist chocolate cake with a dark ganache frosting.', 
             price: 60,
              category: 'dessert',
            imageUri: require('./assets/choclatecake.jpg'), 
            },

            {id: '6',
             name: 'Mini Sliders', 
             description: 'Juicy beef or chicken sliders with melted cheese.', 
             price: 75,
              category: 'snacks',
            imageUri: require('./assets/sliders.jpg'), 
            },

            {id: '7',
             name: 'Mini Quiches', 
             description: 'Fluffy, flavorful bites with spinach, bacon, or mushroom.', 
             price: 50,
              category: 'snacks',
            imageUri: require('./assets/quiches.jpg'), 
            },

            {id: '8',
             name: 'Loaded Nachoss', 
             description: 'Corn chips layered with melted cheese, salsa, and guacamole.', 
             price: 80,
              category: 'snacks',
            imageUri: require('./assets/nachos.jpg'), 
            },

             {id: '9',
             name: 'Mozzarella Sticks', 
             description: 'Melted cheese coated in golden crumbs, served with marinara sauce.', 
             price: 60,
              category: 'snacks',
            imageUri: require('./assets/mozzarellasticks.jpg'), 
            },

            { 
            id: '10', 
            name: 'Classic Breakfast Plate', 
            description: 'Two eggs (any style), crispy bacon, grilled tomato, sausage, and toast.', 
            price: 90, 
            category: 'breakfast', 
            imageUri: require('./assets/classicbreakfast.jpg'), 
        },   
        
         { 
            id: '11', 
            name: 'Bacon & Egg Croissant', 
            description: 'Flaky croissant filled with bacon, scrambled eggs, and melted cheese.', 
            price: 90, 
            category: 'breakfast', 
            imageUri: require('./assets/baconegg.jpg'), 
        }, 
        
         { 
            id: '12', 
            name: 'Smoked Salmon Bagel', 
            description: 'Cream cheese, smoked salmon, capers, and fresh rocket on a toasted bagel.', 
            price: 95, 
            category: 'breakfast', 
            imageUri: require('./assets/smokedsalmonbagel.jpg'), 
        }, 

        { id: '13', 
            name: 'Grilled Chicken Wrap',
             description: 'Juicy grilled chicken, lettuce, tomato, and creamy mayo wrapped in a tortilla.',
              price: 85, 
              category: 'lunch',
               imageUri: require('./assets/grilledchickenwrap.jpg'),
            },

             { id: '14', 
            name: 'Beef Burger Deluxe',
             description: '100% beef patty with melted cheddar, lettuce, tomato, and BBQ sauce on a brioche bun.',
              price: 110, 
              category: 'lunch',
               imageUri: require('./assets/beefburger.jpg'),
            },
            { id: '15', 
            name: 'Paprika Chicken Pizza',
             description: 'Savory paprika-seasoned chicken, bell peppers, onions, and mozzarella cheese on a crispy crust.',
              price: 120, 
              category: 'lunch',
               imageUri: require('./assets/paprikachickenpizza.jpg'),
            },
            { id: '16', 
            name: 'Fish and Chips',
             description: 'Crispy battered fish served with golden fries and tartar sauce.',
              price: 110, 
              category: 'lunch',
               imageUri: require('./assets/fishandChips.jpg'),
            },
            { id: '17', 
            name: 'Seafood Platter',
             description: 'A delightful assortment of fried fish, calamari,prawns and mussels served with tartar sauce and lemon wedges.',
              price: 350, 
              category: 'lunch',
               imageUri: require('./assets/seafoodplatter.jpg'),
            },
            { id: '18', 
            name: 'Grilled Steak',
             description: 'Juicy grilled steak cooked to perfection, served with garlic butter and roasted vegetables.',
              price: 150, 
              category: 'dinner',
               imageUri: require('./assets/grilledsteak.jpg'),
            },
            { id: '20', 
            name: 'Lamb Chops',
             description: 'Chargrilled lamb chops served with garlic mash and mint sauce.',
              price: 190, 
              category: 'dinner',
               imageUri: require('./assets/lambchops.jpg'),
            },
            { id: '21', 
            name: 'Seafood Pasta',
             description: 'Prawns, calamari, and mussels tossed in creamy tomato sauce.',
              price: 185, 
              category: 'dinner',
               imageUri: require('./assets/seafoodpasta.jpg'),
            },
             { id: '22', 
            name: 'BBQ Ribs',
             description: 'Fall-off-the-bone pork ribs glazed in smoky BBQ sauce, served with coleslaw and fries.',
              price: 195, 
              category: 'dinner',
               imageUri: require('./assets/bbqribs.jpg'),
            },
            { id: '23', 
            name: 'Vegetable Stir-Fry',
             description: 'Colorful veggies tossed in sesame soy sauce, served with basmati rice or noodles.',
              price: 100, 
              category: 'vegetarian',
               imageUri: require('./assets/vegstirfry.jpg'),
            },
            { id: '24', 
            name: 'Vegan Curry Bowl',
             description: 'Coconut curry with chickpeas, sweet potato, and lentils, served over rice.',
              price: 130, 
              category: 'vegetarian',
               imageUri: require('./assets/vegancurry.jpg'),
            },
             { id: '25', 
            name: 'Roasted Tomato Soup',
             description: 'Slow-roasted tomatoes blended into a creamy soup, served with garlic bread.',
              price: 80, 
              category: 'vegetarian',
               imageUri: require('./assets/tomatoesoup.jpg'),
            },
             { id: '26', 
            name: 'Vegetable Quesadilla',
             description: 'Toasted tortilla with peppers, onions, and melted cheese, served with salsa.',
              price: 95, 
              category: 'vegetarian',
               imageUri: require('./assets/vegquesdilla.jpg'),
            },
            { id: '27', 
            name: 'Vegan Power Wrap',
             description: 'Hummus, avocado, and grilled veggies wrapped in a spinach tortilla.',
              price: 80, 
              category: 'vegetarian',
               imageUri: require('./assets/veganwrap.jpg'),
            },
            { id: '28', 
            name: 'Grilled Halloumi',
             description: 'Layers of halloumi, grilled aubergine, and roasted red peppers with basil pesto.',
              price: 100, 
              category: 'vegetarian',
               imageUri: require('./assets/grilledhalloumi.jpg'),
            },
             { id: '29',
             name: 'Biscoff Cheesecake', 
             description: 'Creamy cheesecake on a Biscoff biscuit base, topped with caramelized cookie crumble.', 
             price: 85,
              category: 'dessert',
            imageUri: require('./assets/biscoffcheesecake.jpg'), 
            },
            { id: '30',
             name: 'Crème Brûlée', 
             description: 'Silky vanilla custard topped with a perfectly caramelized sugar crust.', 
             price: 90,
              category: 'dessert',
            imageUri: require('./assets/cremebrulee.jpg'), 
            },
            { id: '31',
             name: 'Tiramusu', 
             description: 'Silky vanilla custard topped with a perfectly caramelized sugar crust.', 
             price: 90,
              category: 'dessert',
            imageUri: require('./assets/tiramisu.jpg'), 
            },
            { id: '32',
             name: 'Nutella Crepes', 
             description: 'Thin crepes filled with warm Nutella and topped with strawberries.', 
             price: 90,
              category: 'dessert',
            imageUri: require('./assets/nutellacrepes.jpg'), 
            },
            { id: '33',
             name: 'Apple Crumble', 
             description: 'Baked cinnamon apples topped with buttery crumble and served with vanilla ice cream.', 
             price: 85,
              category: 'dessert',
            imageUri: require('./assets/applecrumble.jpg'), 
            },
            { id: '34',
             name: 'Lemon Meringue Tart', 
             description: 'Zesty lemon curd topped with fluffy, torched meringue.', 
             price: 75,
              category: 'dessert',
            imageUri: require('./assets/lemonmeringue.jpg'), 
            },
             { id: '35',
             name: 'Passionfruit Crush', 
             description: 'Zesty passionfruit, vanilla essence, and soda finished with mint.', 
             price: 78,
              category: 'drinks',
            imageUri: require('./assets/passionfruit.jpg'), 
            },
            { id: '36',
             name: 'Cucumber & Basil Elixir', 
             description: 'Fresh-pressed cucumber, basil syrup, and lime — crisp and cooling.', 
             price: 70,
              category: 'drinks',
            imageUri: require('./assets/cucumberbasil.jpg'), 
            },
            { id: '37',
             name: 'Spiced Hibiscus Cooler', 
             description: 'Hibiscus reduction with ginger, lime, and cinnamon foam', 
             price: 80,
              category: 'drinks',
            imageUri: require('./assets/hibiscus.jpg'), 
            },
            { id: '38',
             name: 'Cinnamon Mocha Fusion', 
             description: 'Espresso, dark cocoa, and a dash of cinnamon spice.', 
             price: 70,
              category: 'drinks',
            imageUri: require('./assets/cinamon.jpg'), 
            },
            { id: '39',
             name: 'Matcha Latte', 
             description: 'Smooth, earthy green tea blended with steamed milk.', 
             price: 70,
              category: 'drinks',
            imageUri: require('./assets/icedmatcha.jpg'), 
            },
    ]);

    const value: AppState = { role, setRole, menuItems, setMenuItems };

    return (
        <AppContext.Provider value={value}>
            <NavigationContainer>
                <StatusBar style="light" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="SignInSignUp" component={SignInSignUpScreen} />
                    <Stack.Screen name="Menu" component={MenuScreen} />
                    <Stack.Screen name="EditMenu" component={EditMenuScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppContext.Provider>
    );
}

// ----------------- Welcome Screen -----------------
function WelcomeScreen({ navigation }: any) {
    return (
        <ImageBackground source={require('./assets/background.jpg')} style={styles.welcomeBg} imageStyle={styles.welcomeImage}>
            <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']} // Dark gradient from top to bottom
                style={StyleSheet.absoluteFillObject}
            >
                <SafeAreaView style={styles.welcomeInner}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.welcomeTitle}>Welcome to Chef'd</Text>
                        <Text style={styles.welcomeSubtitle}>Exceptional food, personalized service.</Text>
                    </View>

                    <TouchableOpacity style={styles.getStartedBtn} onPress={() => navigation.navigate('SignInSignUp')}>
                        <Text style={styles.getStartedText}>Get Started</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </LinearGradient>
        </ImageBackground>
    );
}

// ----------------- Sign In / Sign Up Screen -----------------
function SignInSignUpScreen({ navigation }: any) {
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const { setRole } = useApp();

    // form state
    const [pickedRole, setPickedRole] = useState<'User' | 'Chef'>('User');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = () => {
        setError('');

        if (tab === 'signup') {
            if (!email || !phone || !username || !password) {
                setError('All fields (Role, Email, Phone, Username, Password) are required for Sign Up.');
                return;
            }
        } else {
            if (!username || !password) {
                setError('Username and Password fields are required for Login.');
                return;
            }
        }

        const userRole: 'User' | 'Chef' = pickedRole;

        setRole(userRole);

        
        if (userRole === 'Chef') {
            navigation.reset({ index: 0, routes: [{ name: 'EditMenu' }] });
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'Menu' }] });
        }
    };

    const isLogin = tab === 'signin';
    const heading = isLogin ? 'Login' : 'Create Your New Account';

    return (
        <SafeAreaView style={styles.authContainer}>
            <ImageBackground source={require('./assets/signIn.png')} style={StyleSheet.absoluteFillObject} imageStyle={styles.authBgImage}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={styles.authHeading}>{heading}</Text>
                    {isLogin ? null : <Text style={styles.authSub}>Sign up with the following methods</Text>}

                    <View style={styles.toggleRow}>
                        <TouchableOpacity style={[styles.toggleBtn, tab === 'signin' && styles.toggleActive]} onPress={() => setTab('signin')}>
                            <Text style={[styles.toggleText, tab === 'signin' && styles.toggleTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.toggleBtn, tab === 'signup' && styles.toggleActive]} onPress={() => setTab('signup')}>
                            <Text style={[styles.toggleText, tab === 'signup' && styles.toggleTextActive]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>

                        {/* R1: Role picker styled like the password input */}
                        <View style={[styles.inputRowTransparent, styles.passwordContainer]}>
                            
                            <Picker
                                selectedValue={pickedRole}
                                onValueChange={(v: 'User' | 'Chef') => setPickedRole(v)}
                                // Added explicit background transparency to pickerTransparent
                                style={[styles.pickerTransparent, { flex: 1, height: '100%' }]} 
                                dropdownIconColor="#ffffffff"
                            >
                                <Picker.Item label="User" value="User" />
                                <Picker.Item label="Chef" value="Chef" />
                            </Picker>
                            
                            {/* The indicator uses the same container/styling as the password toggle */}
                            <View style={[styles.passwordToggleBtn, pickedRole === 'Chef' ? styles.pickerIndicatorChef : styles.pickerIndicatorUser]}>
                                <Text style={styles.pickerIndicatorText}>
                                    {pickedRole}
                                </Text>
                            </View>
                        </View>


                        {/* SIGN UP FIELDS */}
                        {tab === 'signup' && (
                            <>
                                <View style={styles.inputRowTransparent}>
                                    <TextInput placeholder="Enter Email" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} style={styles.inputTransparent} keyboardType="email-address" />
                                </View>
                                <View style={styles.inputRowTransparent}>
                                    <TextInput placeholder="Phone Number" placeholderTextColor="#94a3b8" value={phone} onChangeText={setPhone} style={styles.inputTransparent} keyboardType="phone-pad" />
                                </View>
                            </>
                        )}

                        {/* COMMON FIELDS (Username/Password) */}
                        <View style={styles.inputRowTransparent}>
                            <TextInput
                                placeholder="Enter Username"
                                placeholderTextColor="#94a3b8"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.inputTransparent}
                            />
                        </View>

                        {/* Password with toggle  */}
                        <View style={[styles.inputRowTransparent, styles.passwordContainer]}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.inputTransparent, { flex: 1 }]}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggleBtn}>
                            
                                <Text style={{ color: '#fff', fontSize: 16 }}>{showPassword ? '👁️' : '🔒'}</Text>
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.signUpBtn} onPress={onSubmit}>
                            <Text style={styles.signUpText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

// ----------------- Menu Screen (User) -----------------
function MenuScreen({ navigation }: any) {
    const { menuItems, setRole } = useApp();
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    const filtered = menuItems.filter((m) => m.category === activeCategory);

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
    };

    const handleBackToLogin = () => {
        setRole(null);
        navigation.reset({ index: 0, routes: [{ name: 'SignInSignUp' }] });
    };

    return (
        <SafeAreaView style={styles.screenContainer}>
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>Menu</Text>
                <TouchableOpacity style={styles.backBtn} onPress={handleBackToLogin}>
                    <Text style={styles.backBtnText}>{'< Back to Login'}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 60 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} style={[styles.categoryPill, activeCategory === cat && styles.categoryActive]}>
                            <Text style={[styles.categoryText, activeCategory === cat && { color: '#fff' }]}>{cat.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList data={filtered} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 12 }} renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuCard} onPress={() => handleItemClick(item)}>
                    {item.imageUri ? (
                        <Image
                            source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : (item.imageUri as ImageSourcePropType)}
                            style={styles.menuImage}
                        />
                    ) : (
                        <View style={[styles.menuImage, { justifyContent: 'center', alignItems: 'center' }]}><Text>Image</Text></View>
                    )}
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.name} <Text style={{ fontWeight: '600', color: '#d94b4b' }}>R{item.price}</Text></Text>
                        <Text style={{ marginTop: 6, color: '#4b5563' }}>{item.description?.substring(0, 50)}...</Text>
                    </View>
                </TouchableOpacity>
            )} ListEmptyComponent={<Text style={{ padding: 20 }}>No items in this category yet.</Text>} />

            <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

        </SafeAreaView>
    );
}

// ----------------- Item Detail Modal (User) -----------------
function ItemDetailModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
    if (!item) return null;

    return (
        <Modal visible={!!item} animationType="fade" onRequestClose={onClose} transparent>
            <View style={styles.modalBackdrop}>
                <View style={styles.itemDetailModal}>
                    {/* Back arrow to go back to the menu */}
                    <TouchableOpacity onPress={onClose} style={styles.modalBackBtn}>
                        <Text style={styles.modalBackText}>{'< Back'}</Text>
                    </TouchableOpacity>

                    {/* Image becomes bigger */}
                                    {item.imageUri ? (
                                        <Image
                                            source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : (item.imageUri as ImageSourcePropType)}
                                            style={styles.detailImage}
                                        />
                                    ) : (
                                        <View style={[styles.detailImage, { justifyContent: 'center', alignItems: 'center' }]}><Text>No Image</Text></View>
                                    )}

                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={styles.detailName}>{item.name}</Text>
                        <Text style={styles.detailPrice}>R{item.price}</Text>
                        <Text style={styles.detailDescription}>{item.description}</Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// ----------------- Confirm Delete Modal (in-app) -----------------
function ConfirmDeleteModal({ visible, onConfirm, onCancel }: { visible: boolean; onConfirm: () => void; onCancel: () => void }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.modalBackdrop}>
                <View style={[styles.itemDetailModal, { padding: 20, alignItems: 'center' }]}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Are you sure you would like to delete this item?</Text>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TouchableOpacity onPress={onConfirm} style={[styles.signUpBtn, { backgroundColor: '#ef4444', marginRight: 12, paddingHorizontal: 20, paddingVertical: 12 }]}>
                            <Text style={styles.signUpText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel} style={[styles.signUpBtn, { backgroundColor: '#6b7280', paddingHorizontal: 20, paddingVertical: 12 }]}>
                            <Text style={styles.signUpText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


// ----------------- Edit Menu Screen (Chef) -----------------
function EditMenuScreen({ navigation }: any) {
    const { menuItems, setMenuItems, setRole } = useApp();
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<MenuItem | null>(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<string | null>(null);

    const openAdd = () => {
        setEditing(null);
        setModalVisible(true);
    };
    const openEdit = (item: MenuItem) => {
        setEditing(item);
        setModalVisible(true);
    };

    const removeItem = (id: string) => {
    // Open in-app confirmation modal instead of Alert
    setToDeleteId(id);
    setConfirmVisible(true);
    };

    const handleBackToLogin = () => {
        setRole(null);
        navigation.reset({ index: 0, routes: [{ name: 'SignInSignUp' }] });
    };

    // R8: Footer component for the "+ Add" button
    const ListFooterComponent = () => (
        <TouchableOpacity style={styles.addBtnFooter} onPress={openAdd}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>+ Add New Item</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.screenContainer}>
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>Edit Menu</Text>
                <TouchableOpacity style={styles.backBtn} onPress={handleBackToLogin}>
                    <Text style={styles.backBtnText}>{'< Back to Login'}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 60 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)} style={[styles.categoryPill, activeCategory === cat && styles.categoryActive]}>
                            <Text style={[styles.categoryText, activeCategory === cat && { color: '#fff' }]}>{cat.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={menuItems.filter(m => m.category === activeCategory)}
                keyExtractor={i => i.id}
                contentContainerStyle={{ padding: 12 }}
                renderItem={({ item }) => (
                    <View style={styles.menuCard}>
                        {item.imageUri ? (
                            <Image
                                source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : (item.imageUri as ImageSourcePropType)}
                                style={styles.menuImage}
                            />
                        ) : (
                            <View style={[styles.menuImage, { justifyContent: 'center', alignItems: 'center' }]}><Text>Image</Text></View>
                        )}
                        <View style={{ flex: 1, paddingLeft: 12 }}>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.name} <Text style={{ fontWeight: '600', color: '#444' }}>R{item.price}</Text></Text>
                            <Text style={{ marginTop: 6, color: '#4b5563' }}>{item.description}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={styles.smallBtn} onPress={() => openEdit(item)}><Text style={{ color: '#4f46e5' }}>Edit</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.smallBtn, { marginLeft: 12, backgroundColor: '#fecaca' }]} onPress={() => removeItem(item.id)}><Text style={{ color: '#dc2626' }}>Delete</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ padding: 20 }}>No items in this category yet.</Text>}
                ListFooterComponent={ListFooterComponent}
            />

            <EditModal visible={modalVisible} onClose={() => setModalVisible(false)} editing={editing} activeCategory={activeCategory} />
            <ConfirmDeleteModal
                visible={confirmVisible}
                onConfirm={() => {
                    if (toDeleteId) {
                        setMenuItems(menuItems.filter(m => m.id !== toDeleteId));
                    }
                    setToDeleteId(null);
                    setConfirmVisible(false);
                }}
                onCancel={() => {
                    setToDeleteId(null);
                    setConfirmVisible(false);
                }}
            />
        </SafeAreaView>
    );
}

// ----------------- Edit/Add Modal Component -----------------
function EditModal({ visible, onClose, editing, activeCategory }: { visible: boolean; onClose: () => void; editing: MenuItem | null; activeCategory: string }) {
    const { menuItems, setMenuItems } = useApp();
    const [name, setName] = useState(editing?.name ?? '');
    const [desc, setDesc] = useState(editing?.description ?? '');
    const [price, setPrice] = useState(editing ? String(editing.price) : '');
    const [imageUri, setImageUri] = useState<ImageSourcePropType | string | null | undefined>(editing?.imageUri ?? null);
    const [error, setError] = useState('');

    React.useEffect(() => {
        setName(editing?.name ?? '');
        setDesc(editing?.description ?? '');
        setPrice(editing ? String(editing.price) : '');
    setImageUri(editing?.imageUri ?? null);
        setError('');
    }, [editing, visible]);

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access media library is required!');
                return;
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes:'images', quality: 0.7, allowsEditing: true });
        if (!result.canceled) {
            // @ts-ignore
            const uri = result.assets ? result.assets[0].uri : result.uri;
            setImageUri(uri as string);
        }
    };

    const save = () => {
        setError('');
        if (!name || !price) {
            setError('Name and Price are required to save.');
            return;
        }
        if (editing) {
            setMenuItems(menuItems.map(m => m.id === editing.id ? { ...m, name, description: desc, price: Number(price), imageUri, category: activeCategory } : m));
        } else {
            const id = Date.now().toString();
            const newItem: MenuItem = { id, name, description: desc, price: Number(price), imageUri, category: activeCategory };
            setMenuItems([newItem, ...menuItems]);
        }
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#1f2937' }}>{editing ? 'Edit Item' : 'Add Item'}</Text>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>Category: {activeCategory.toUpperCase()}</Text>

                <ScrollView style={{ marginTop: 12 }}>
                    <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.inputModal} />
                    <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={styles.inputModal} multiline />
                    <TextInput placeholder="Price (R)" value={price} onChangeText={setPrice} style={styles.inputModal} keyboardType="numeric" />

                    {error ? <Text style={styles.errorTextModal}>{error}</Text> : null}

                    <TouchableOpacity style={[styles.signUpBtn, { marginTop: 16, backgroundColor: '#4f46e5', padding: 10 }]} onPress={pickImage}><Text style={{ fontWeight: '700', color: '#fff' }}>Upload Image</Text></TouchableOpacity>
                    {imageUri ? (
                        <Image
                            source={typeof imageUri === 'string' ? { uri: imageUri } : (imageUri as ImageSourcePropType)}
                            style={{ width: '100%', height: 180, marginTop: 12, borderRadius: 8 }}
                            resizeMode="cover"
                        />
                    ) : null}

                    <View style={{ height: 20 }} />
                    <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: '#10b981' }]} onPress={save}><Text style={styles.signUpText}>Save Item</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.signUpBtn, { marginTop: 12, backgroundColor: '#ef4444' }]} onPress={onClose}><Text style={styles.signUpText}>Cancel</Text></TouchableOpacity>
                </ScrollView>

            </SafeAreaView>
        </Modal>
    );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
    // Welcome Screen
    welcomeBg: { flex: 1, backgroundColor: '#000' },
    welcomeImage: { opacity: 0.85, resizeMode: 'cover', width: width, height: '100%' },
    welcomeInner: { flex: 1, padding: 20, justifyContent: 'space-between' },
    welcomeTitle: { color: '#fff', fontSize: 40, fontWeight: '900', textAlign: 'center' },
    welcomeSubtitle: { color: '#fff', marginTop: 8, textAlign: 'center', opacity: 0.9, fontSize: 18 },
    getStartedBtn: { backgroundColor: '#d94b4b', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 30, alignSelf: 'center', marginBottom: 20 },
    getStartedText: { color: '#fff', fontWeight: '800', fontSize: 18 },

    // Sign in/Signup Screen
    authBgImage: { opacity: 0.1, backgroundColor: '#000', resizeMode: 'cover', width: width, height: '100%' },
    authContainer: { flex: 1, backgroundColor: '#1f2937' },
    authHeading: { fontSize: 32, fontWeight: '900', color: '#fff', marginTop: 12, },
    authSub: { color: '#9ca3af', marginTop: 6, fontSize: 16 },
    toggleRow: { flexDirection: 'row', marginTop: 30, backgroundColor: '#374151', borderRadius: 24, overflow: 'hidden' },
    toggleBtn: { flex: 1, padding: 12, alignItems: 'center' },
    toggleActive: { backgroundColor: '#d94b4b' },
    toggleText: { color: '#9ca3af', fontWeight: '700', fontSize: 16 },
    toggleTextActive: { color: '#fff' },

    inputContainer: { marginTop: 30 },
    
    // ** Added backgroundColor: 'transparent' to ensure transparency on different platforms **
    pickerTransparent: {
        color: '#fff',
        flex: 1,
        paddingHorizontal: 15, 
        backgroundColor: 'transparent', 
    },
    
    // --- STYLES FOR ROLE INDICATOR (MIMICKING PASSWORD TOGGLE) ---
    pickerIndicatorUser: {
        backgroundColor: '#4f46e5', // User color
    },
    pickerIndicatorChef: {
        backgroundColor: '#10b981', // Chef color
    },
    pickerIndicatorText: {
        fontWeight: '700',
        fontSize: 14,
        color: '#fff',
    },
    // --- END STYLES FOR ROLE INDICATOR ---

    inputRowTransparent: {
        marginTop: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 15, // Default padding for other text inputs
    },
    inputTransparent: { paddingVertical: 12, color: '#fff', fontSize: 16 },

    // R4: Password container (used for both Password and Role Picker rows)
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 0, // Reset padding for custom toggle button
    },
    passwordToggleBtn: {
        // This style now acts as the right-side button container for both
        paddingVertical: 12,
        paddingHorizontal: 15,
        height: '100%',
        justifyContent: 'center',
    },

    signUpBtn: { marginTop: 30, backgroundColor: '#d94b4b', padding: 16, borderRadius: 12, alignItems: 'center' },
    signUpText: { color: '#fff', fontWeight: '800', fontSize: 18 },
    errorText: { color: '#f87171', marginTop: 10, textAlign: 'center', fontWeight: '600' },

    // Menu/Edit Menu Screens
    screenContainer: { flex: 1, backgroundColor: '#f3f4f6' },
    screenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
    screenTitle: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
    backBtn: { padding: 8, borderRadius: 8, backgroundColor: '#e5e7eb' },
    backBtnText: { color: '#374151', fontSize: 14, fontWeight: '600' },

    categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e6eef0', marginRight: 10 },
    categoryActive: { backgroundColor: '#d94b4b' },
    categoryText: { fontWeight: '700', color: '#4b5563' },

    menuCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84 },
    menuImage: { width: 100, height: 80, borderRadius: 8, backgroundColor: '#e5e7eb' },
    smallBtn: { padding: 8, borderRadius: 8, backgroundColor: '#eef2ff' },

    addBtnFooter: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', margin: 12, marginTop: 0 },

    // Edit Modal Styles
    inputModal: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#e5e7eb' },
    errorTextModal: { color: '#ef4444', marginTop: 8, fontWeight: '600' },

    // Item Detail Modal styles
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    itemDetailModal: { width: '90%', maxHeight: '90%', backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden' },
    modalBackBtn: { position: 'absolute', top: 15, left: 15, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20 },
    modalBackText: { fontWeight: '700', color: '#1f2937' },
    detailImage: { width: '100%', height: 250, backgroundColor: '#e5e7eb' },
    detailName: { fontSize: 28, fontWeight: '900', color: '#1f2937', marginBottom: 5 },
    detailPrice: { fontSize: 22, fontWeight: '800', color: '#d94b4b', marginBottom: 15 },
    detailDescription: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
});
