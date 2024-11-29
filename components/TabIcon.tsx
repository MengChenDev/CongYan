import { Text } from "@ui-kitten/components";
import { Image, ImageSourcePropType, View } from "react-native";
const TabIcon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: ImageSourcePropType;
  color?: string;
  name?: string;
  focused?: boolean;
}) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 24, height: 24 }}
      />
      {name && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"}`}
          category="c1"
          style={{ color: color }}
        >
          {name}
        </Text>
      )}
    </View>
  );
};

export default TabIcon;
