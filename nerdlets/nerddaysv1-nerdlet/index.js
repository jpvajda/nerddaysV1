// SAMPLE APP REPO: https://github.com/jpvajda/nerddaysV1
// PRE-REQ: https://github.com/newrelic-experimental/nerd-days-v1/tree/main/open-source-track/third-party-secrets
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

// Community components https://www.npmjs.com/package/@newrelic/nr1-community/v/1.3.0-alpha.5
import { UserSecretsMutation, UserSecretsQuery } from "@newrelic/nr1-community";

// function for hiding secret value in UI
const hideSecret = (data) => {
  const { value } = data;

  const lengthVisible = value.length >= 7 ? 5 : value.length - 2;
  const replacementLength = value.length - lengthVisible;
  const regex = new RegExp("^.{" + replacementLength + "}", "g");
  const replacementValue = value.replace(
    regex,
    Array(replacementLength).join("*")
  );

  return {
    ...data,
    value: replacementValue,
  };
};

export default class Nerddaysv1NerdletNerdlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Local component state for storing the values from these input fields.
      secretName: "",
      secretValue: "",
      userSecretsQueryKey: "",

      // Control re-querying by updating this when a user takes an action
      requery: Date.now(),

      // Toggles Visibility of secrets
      hideSecrets: false,
    };
  }

  // delete secret function
  async deleteSecret(key) {
    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.DELETE_SECRET,
      name: key,
    };
    await UserSecretsMutation.mutate(mutation);
    this.setState({ requery: Date.now() });
  }

  // write secret function
  async writeSecret() {
    const { secretName, secretValue } = this.state;

    const mutation = {
      actionType: UserSecretsMutation.ACTION_TYPE.WRITE_SECRET,
      name: secretName,
      value: secretValue,
    };

    // Run the graphql mutation using the input to save the secret.
    await UserSecretsMutation.mutate(mutation);

    // Reset state for input fields after submission.
    this.setState({ secretName: null, secretValue: null, requery: Date.now() });
  }

  render() {
    const {
      hideSecrets,
      secretName,
      secretValue,
      requery,
      userSecretsQueryKey,
    } = this.state;

    return (
      // A Set of components containing the application functionality.
      // https://developer.newrelic.com/explore-docs/intro-to-sdk
      <Grid
        className="primary-grid"
        spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}
      >
        <GridItem className="primary-content-container" columnSpan={12}>
          <main className="primary-content full-height container">
            <div className="secrets">
              <Stack verticalType={Stack.VERTICAL_TYPE.TOP}>
                <StackItem>
                  <div className="title"></div>
                  ADD A SECRET
                  <Card>
                    <CardBody>
                      {/* secret name field */}
                      <TextField
                        autofocus
                        label="Secret Name"
                        placeholder="enter secret name"
                        onChange={({ target }) => {
                          this.setState({ secretName: target.value });
                        }}
                        value={secretName || ""}
                      />
                      {/* secret value field */}
                      <TextField
                        autofocus
                        label="Secret Value"
                        placeholder="enter secret"
                        onChange={({ target }) => {
                          this.setState({ secretValue: target.value });
                        }}
                        value={secretValue || ""}
                      />
                    </CardBody>
                    {/* saves the secret to NerdVault */}
                    <Button
                      className="button"
                      onClick={() => this.writeSecret()}
                      type={Button.TYPE.PRIMARY}
                      iconType={
                        Button.ICON_TYPE.DOCUMENTS__DOCUMENTS__FILE__A_ADD
                      }
                    >
                      Save
                    </Button>
                    {/* hides secret values */}
                    <Button
                      className="button"
                      onClick={() =>
                        this.setState((prevState) => ({
                          hideSecrets: !prevState.hideSecrets,
                        }))
                      }
                      type={Button.TYPE.PRIMARY}
                      iconType={
                        hideSecrets
                          ? Button.ICON_TYPE.INTERFACE__OPERATIONS__SHOW
                          : Button.ICON_TYPE.INTERFACE__OPERATIONS__HIDE
                      }
                    >
                      {hideSecrets ? "Show Secrets" : "Hide Secrets"}
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
                        <div key={requery}>
                          <UserSecretsQuery name={userSecretsQueryKey}>
                            {({ data, loading }) => {
                              if (loading) {
                                return <Spinner />;
                              }

                              if (!data) {
                                return <h3>Secret not found</h3>;
                              }

                              return (
                                <pre>
                                  {JSON.stringify(
                                    hideSecrets ? hideSecret(data) : data,
                                    null,
                                    2
                                  )}
                                </pre>
                              );
                            }}
                          </UserSecretsQuery>
                        </div>
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
                      <div key={requery}>
                        <UserSecretsQuery>
                          {({ data, loading }) => {
                            if (loading) {
                              return <Spinner />;
                            }

                            if (data.length === 0) {
                              return <h3>No secrets found</h3>;
                            }

                            return data.map((secret, index) => {
                              return (
                                <div key={index}>
                                  <pre>
                                    {JSON.stringify(
                                      hideSecrets ? hideSecret(secret) : secret,
                                      null,
                                      2
                                    )}
                                  </pre>
                                  {/* Deletes secrets*/}
                                  <Button
                                    className="button"
                                    onClick={() =>
                                      this.deleteSecret(secret.key)
                                    }
                                    type={Button.TYPE.PRIMARY}
                                    iconType={
                                      Button.ICON_TYPE
                                        .INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              );
                            });
                          }}
                        </UserSecretsQuery>
                      </div>
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
