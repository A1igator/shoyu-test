import React from 'react';
import styled from 'styled-components';
import { Table, Button } from 'semantic-ui-react';
import copy from 'copy-to-clipboard';

const ScrollContainer = styled.div`
  height: 50vh;
  overflow-y: scroll;
`;

const TokenName = styled.div`
  opacity: 0.5;
`;

const kovanTokens = [
  {
    name: 'Sushi',
    symbol: 'SUSHI',
    address: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
  },
  {
    name: 'Synthetix',
    symbol: 'SNX',
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  },
  {
    name: '0x Protocol Token',
    symbol: 'ZRX',
    address: '0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3',
  },
  {
    name: 'Compound',
    symbol: 'COMP',
    address: '0x61460874a7196d6a22D1eE4922473664b3E95270',
  },
  {
    name: 'Basic Attention Token',
    symbol: 'BAT',
    address: '0x482dC9bB08111CB875109B075A40881E48aE02Cd',
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
  },
  {
    name: 'USD Coin USDC',
    symbol: 'USDC',
    address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
  },
  {
    name: 'Compound Dai',
    symbol: 'cDAI',
    address: '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD',
  },
];

function TokenList() {
  return (
    <ScrollContainer>
      <Table inverted basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {kovanTokens.map((token) => (
            <Table.Row key={token.name}>
              <Table.Cell>
                <b>{token.symbol}</b>
                <TokenName>{token.name}</TokenName>
              </Table.Cell>
              <Table.Cell>{token.address}</Table.Cell>
              <Table.Cell>
                <Button
                  inverted
                  icon="copy"
                  onClick={() => {
                    copy(token.address);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ScrollContainer>
  );
}

export default TokenList;
