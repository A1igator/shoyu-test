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

const tokens = [
  {
    name: 'Sushi',
    symbol: 'SUSHI',
    address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  },
  {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  {
    name: 'Alchemix',
    symbol: 'ALCX',
    address: '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF',
  },
  {
    name: 'yearn.finance',
    symbol: 'YFI',
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  },
  {
    name: 'Olympus',
    symbol: 'OHM',
    address: '0x383518188C0C6d7730D91b2c03a03C837814a899',
  },
  {
    name: 'AAVE',
    symbol: 'AAVE',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  },
  {
    name: 'Chain Link',
    symbol: 'LINK',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  },
  {
    name: '0x',
    symbol: 'ZRX',
    address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
  },
  {
    name: 'Defi Pulse Index',
    symbol: 'DPI',
    address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
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
          {tokens.map((token) => (
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
