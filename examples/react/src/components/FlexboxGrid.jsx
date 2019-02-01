import React from "react";
import styled, { css } from "styled-components";

export const Grid = styled.div`
  margin-right: auto;
  margin-left: auto;
`;

const HorizontalAlign = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const VeritcalAlign = {
  top: "flex-start",
  middle: "center",
  bottom: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: ${p => p.grow || 0};
  flex-shrink: ${p => p.shrink || 0};
  flex-wrap: ${p => (p.nowrap ? "nowrap" : "wrap")};
  ${p =>
    p.align &&
    css`
      justify-content: ${HorizontalAlign[p.align]};
    `};
  ${p =>
    p.valign &&
    css`
      align-items: ${VeritcalAlign[p.valign]};
    `};
  ${p =>
    p.space &&
    css`
      justify-content: ${"space-" + p.space};
    `};
  ${p =>
    p.anchor &&
    css`
      align-self: ${HorizontalAlign[p.anchor] || VeritcalAlign[p.anchor]};
    `};
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: ${p => p.grow || 0};
  flex-shrink: ${p => p.shrink || 0};
  ${p =>
    p.align &&
    css`
      align-items: ${HorizontalAlign[p.align]};
    `};
  ${p =>
    p.valign &&
    css`
      justify-content: ${VeritcalAlign[p.valign]};
    `};
  ${p =>
    p.space &&
    css`
      justify-content: ${"space-" + p.space};
    `};
  ${p =>
    p.anchor &&
    css`
      align-self: ${HorizontalAlign[p.anchor] || VeritcalAlign[p.anchor]};
    `};
`;
