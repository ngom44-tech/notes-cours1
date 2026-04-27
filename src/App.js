import { useState, useRef, useEffect } from "react";

const COURSE_COLORS = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5", "#F15BB5"];
const NOTE_DOT_COLORS = ["#1e1e2c", "#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5"];

const SYMBOL_TABS = [
  {
    id: "math", label: "∑ Maths",
    groups: [
      { name: "Opérations", symbols: [
        { label: "√", insert: "√" }, { label: "∛", insert: "∛" }, { label: "²", insert: "²" },
        { label: "³", insert: "³" }, { label: "×", insert: "×" }, { label: "÷", insert: "÷" },
        { label: "±", insert: "±" }, { label: "∞", insert: "∞" }, { label: "π", insert: "π" },
      ]},
      { name: "Comparaisons", symbols: [
        { label: "≠", insert: "≠" }, { label: "≈", insert: "≈" }, { label: "≤", insert: "≤" },
        { label: "≥", insert: "≥" }, { label: "≡", insert: "≡" },
      ]},
      { name: "Calcul", symbols: [
        { label: "∑", insert: "∑" }, { label: "∏", insert: "∏" }, { label: "∫", insert: "∫" },
        { label: "∂", i
