import styled from 'styled-components';

const repeat = (str: string, num: number) => str.repeat(num);

const StyledTitle = styled.div<{ $title: string }>`
  overflow: hidden;
  overflow: visible;

  span {
    -webkit-text-stroke: 1px var(--accentSolid);
    color: var(--accentSolid);
    font-size: 6rem;
    font-weight: 700;
    overflow: visible;
    position: relative;

    &:before {
      content: '${(props) => repeat(props.$title, 100)}';
      color: transparent;
      left: -313.32ch;
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

export const Title = ({ value }: { value: string }) => (
  <StyledTitle $title={value}>
    <span>{value}</span>
  </StyledTitle>
);
