import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  TextField,
  Button,
  Stack,
  StackItem,
} from "nr1";
import { UserSecretsMutation, UserSecretsQuery } from "@newrelic/nr1-community";

export default class Nerddaysv1NerdletNerdlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //  Inputs for writing keys
      secretName: null,
      secretValue: null,

      // Input for finding a single key
      userSecretsQueryKey: null,
    };
  }

  async deleteSecret(key) {
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.DELETE_SECRET,
      name: key,
    };
    await UserSecretsMutation.mutate(mutation);
  }

  async writeSecret() {
    const { secretName, secretValue } = this.state;

    // Put together parameters
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.WRITE_SECRET, // Allows you to toggle WRITE/DELETE actions utilizing the same component
      name: secretName,
      value: secretValue,
    };

    // Save to NerdVault
    await UserSecretsMutation.mutate(mutation);

    // Reset input fields
    this.setState({ secretName: null, secretValue: null });
  }

  render() {
    const { secretName, secretValue, userSecretsQueryKey } = this.state;

    return (
      <>
        {/* A StackItem containing the secret inputs and save functionality*/}

        <div className="secrets">
          <Stack verticalType={Stack.VERTICAL_TYPE.FILL_EVENLY}>
            <StackItem>
              <div className="title"></div>
              ADD A SECRET
              <Card>
                <CardHeader />
                <CardBody>
                  <TextField
                    autofocus
                    label="Secret Name"
                    placeholder="enter secret name"
                    onChange={({ target }) => {
                      this.setState({ secretName: target.value });
                    }}
                    value={secretName}
                  />
                  <TextField
                    autofocus
                    label="Secret Value"
                    placeholder="enter secret"
                    onChange={({ target }) => {
                      this.setState({ secretValue: target.value });
                    }}
                    value={secretValue}
                  />
                </CardBody>

                {/* A trigger function that calls UserSecretsMutation component and saves secret to NerdVault */}
                <Button onClick={() => this.writeSecret()} type="primary">
                  Save
                </Button>
              </Card>
            </StackItem>
            <StackItem>
              {/* Grid for showing a Single Key */}
              <div className="title"></div>
              QUERY
              <Card>
                <CardHeader />
                <CardBody>
                  <TextField
                    autofocus
                    label="Retrieve by name"
                    placeholder="enter secret name"
                    onChange={({ target }) => {
                      this.setState({ userSecretsQueryKey: target.value });
                    }}
                  />

                  {userSecretsQueryKey && (
                    <UserSecretsQuery key={userSecretsQueryKey}>
                      {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
                    </UserSecretsQuery>
                  )}
                </CardBody>
              </Card>
            </StackItem>
            <StackItem>
              {/* Retrieve All User Keys */}
              <div className="title"></div>
              RETRIEVE
              <Card>
                <CardHeader />
                <CardBody>
                  <UserSecretsQuery>
                    {({ data }) => {
                      if (!data) {
                        return <h3>No secrets found</h3>;
                      }
                      return data.map((secret) => {
                        return (
                          <>
                            <pre>{JSON.stringify(secret, null, 2)}</pre>
                            <Button
                              onClick={() => this.deleteSecret(secret.name)}
                              type="primary"
                            >
                              Delete
                            </Button>
                          </>
                        );
                      });
                    }}
                  </UserSecretsQuery>
                  <Button onClick={() => this.setState()} type="primary">
                    Refresh
                  </Button>
                </CardBody>
              </Card>
            </StackItem>
          </Stack>
        </div>
      </>
    );
  }
}
