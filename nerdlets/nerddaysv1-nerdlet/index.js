import React from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  TextField,
  Button,
  Spinner,
  Stack,
  StackItem,
} from "nr1";
import { UserSecretsMutation, UserSecretsQuery } from "@newrelic/nr1-community";

export default class Nerddaysv1NerdletNerdlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Local component state for storing the values from these input fields.
      secretName: "",
      secretValue: "",

      // Local component state for storing the values from these input fields.
      userSecretsQueryKey: "",
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

    // Options for the mutate method.
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.WRITE_SECRET, // Allows you to toggle WRITE/DELETE.
      name: secretName,
      value: secretValue,
    };

    // Run the graphql mutation using the input to save the secret.
    await UserSecretsMutation.mutate(mutation);

    // Reset state for input fields after submission.
    this.setState({ secretName: null, secretValue: null });
  }

  render() {
    const { secretName, secretValue, userSecretsQueryKey } = this.state;

    return (
      // A Set of components containing the application functionality.
      <Grid
        className="primary-grid"
        spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}
      >
        <GridItem className="primary-content-container" columnSpan={12}>
          <main className="primary-content full-height">
            <div className="secrets">
              <Stack verticalType={Stack.VERTICAL_TYPE.CENTER}>
                <StackItem>
                  <div className="title"></div>
                  ADD A SECRET
                  <Card>
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
                    {/* A function that saves the secret to NerdVault */}
                    <Button onClick={() => this.writeSecret()} type="primary">
                      Save
                    </Button>
                  </Card>
                </StackItem>
                <StackItem>
                  {/* Fetch for returning single key */}
                  <div className="title"></div>
                  FETCH ONE
                  <Card>
                    <CardBody>
                      <TextField
                        autofocus
                        label="Retrieve by name"
                        placeholder="enter secret name"
                        onChange={({ target }) => {
                          this.setState({ userSecretsQueryKey: target.value });
                        }}
                        value={userSecretsQueryKey}
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
                  {/* Fetch All User Keys */}
                  <div className="title"></div>
                  FETCH ALL
                  <Card>
                    <CardBody>
                      <UserSecretsQuery>
                        {({ data, loading }) => {
                          if (loading) {
                            return <Spinner />;
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
          </main>
        </GridItem>
      </Grid>
    );
  }
}
