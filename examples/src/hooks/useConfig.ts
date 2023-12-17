import configContext from "@/contexts/configContext";
import { useContext } from "react";

export default function useConfig() {
  return useContext(configContext);
}