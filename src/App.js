import { useState, useRef, useEffect } from "react";

const COURSE_COLORS = ["#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5", "#F15BB5"];
const NOTE_DOT_COLORS = ["#1e1e2c", "#FFD166", "#06D6A0", "#118AB2", "#EF476F", "#9B5DE5"];

const SYMBOL_TABS = [
  {
    id: "math", label: "Maths",
    groups: [
      { name: "Operations", symbols: [
        { label: "racine", insert: "racine" }, { label: "x2", insert: "x2" },
        { label: "x", insert: "x" }, { label: "/", insert: "/" },
        { label: "+-", insert: "+-" }, { label: "inf", insert: "inf" }, { label: "pi", insert: "pi" },
      ]},
      { name: "Comparaisons", symbols: [
        { label: "!=", insert: "!=" }, { label: "~=", insert: "~=" }, { label: "<=", insert: "<=" },
        { label: ">=", insert: ">=" }, { label: "===", insert: "===" },
      ]},
      { name: "Calcul", symbols: [
        { label: "somme", insert: "somme" }, { label: "integrale", insert: "integrale" },
        { label: "Delta", insert: "Delta" }, { label: "nabla", insert: "nabla" },
      ]},
      { name: "Grec", symbols: [
        { label: "alpha", insert: "alpha" }, { label: "beta", insert: "beta" },
        { label: "gamma", insert: "gamma" }, { label: "theta", insert: "theta" },
        { label: "lambda", insert: "lambda" }, { label: "mu", insert: "mu" },
        { label: "sigma", insert: "sigma" }, { label: "omega", insert: "omega" },
      ]},
    ],
  },
  {
    id: "physics", label: "Physique",
    groups: [
      { name: "Unites", symbols: [
        { label: "Ohm", insert: "Ohm" }, { label: "degC", insert: "degC" },
        { label: "Hz", insert: "Hz" }, { label: "J", insert: "J" },
        { label: "W", insert: "W" }, { label: "eV", insert: "eV" },
      ]},
      { name: "Vecteurs", symbols: [
        { label: "F->", insert: "F->" }, { label: "v->", insert: "v->" },
        { label: "a->", insert: "a->" }, { label: "p->", insert: "p->" },
      ]},
      { name: "Electricite", symbols: [
        { label: "U=", insert: "U = " }, { label: "I=", insert: "I = " },
        { label: "R=", insert: "R = " }, { label: "P=", insert: "P = " },
      ]},
