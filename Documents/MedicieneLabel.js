import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { PillIcon } from "@/Documents/Icons";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    orientation: "landscape",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View style={styles.section}>
        <PillIcon />

        <Text>Section #1</Text>
        <Text>Section #1</Text>
        <Text>Section #1</Text>
        <Text>Section #1</Text>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

//rendering the pdf is handled in the api/render/route.js
