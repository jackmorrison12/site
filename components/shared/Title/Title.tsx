'use client';

import styled from 'styled-components';

const repeat = (str: string, num: number) => str.repeat(num);

const StyledTitle = styled.div<{ $title: string; $offset: string }>`
  overflow: hidden;
  overflow: visible;

  span {
    -webkit-text-stroke: 1px ${(props) => props.theme.colours.primary.default};
    color: ${(props) => props.theme.colours.primary.default};
    font-size: 6rem;
    font-weight: 700;
    overflow: visible;
    position: relative;

    &:before {
      content: '${(props) => repeat(props.$title, 100)}';
      color: transparent;
      left: ${(props) => props.$offset}ch;
      position: absolute;
    }

    &:after {
      content: '${(props) => repeat(props.$title, 100)}';
      color: transparent;
    }

    @media (max-width: 48em) {
      font-size: 2rem;
    }
  }
`;

export const Title = ({ value, offset, bgOverride }: { value: string; offset: string; bgOverride?: string }) => (
  <StyledTitle $title={bgOverride ?? value} $offset={offset}>
    <span>{value}</span>
  </StyledTitle>
);
