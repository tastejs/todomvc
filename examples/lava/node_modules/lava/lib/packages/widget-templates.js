Lava.widgets = {
	InputAbstract: {
		template: [
			"\r\n\t\t",
			{
				name: "input_view",
				type: "include"
			},
			"\r\n\t"
		],
		sugar: {
			attribute_mappings: {
				name: {
					type: "property",
					type_name: "String"
				},
				value: {
					type: "property",
					type_name: "String"
				},
				disabled: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_disabled"
				},
				required: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_required"
				},
				readonly: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_readonly"
				}
			}
		},
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	CheckBox: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "CheckboxElement",
						tag_name: "input",
						events: {
							change: [{
								locator_type: "Name",
								locator: "checkbox",
								name: "checked_changed"
							}],
							focus: [{
								locator_type: "Name",
								locator: "checkbox",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "checkbox",
								name: "_blurred"
							}],
							compatible_changed: [{
								locator_type: "Name",
								locator: "checkbox",
								name: "checked_changed"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "checkbox",
									tail: ["name"]
								}]
							},
							value: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "checkbox",
									tail: ["value"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "checkbox",
									tail: ["is_disabled"]
								}]
							},
							required: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "checkbox",
									tail: ["is_required"]
								}]
							},
							readonly: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "checkbox",
									tail: ["is_readonly"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "checkbox",
							name: "CHECKBOX_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}],
					template: []
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "checkbox",
			root_resource_name: "CHECKBOX_ELEMENT",
			attribute_mappings: {
				checked: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_checked"
				},
				indeterminate: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_indeterminate"
				}
			}
		},
		default_events: [],
		real_class: "input.CheckBox",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	TextArea: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "textarea",
						events: {
							change: [{
								locator_type: "Name",
								locator: "textarea",
								name: "value_changed"
							}],
							input: [{
								locator_type: "Name",
								locator: "textarea",
								name: "input"
							}],
							focus: [{
								locator_type: "Name",
								locator: "textarea",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "textarea",
								name: "_blurred"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "textarea",
									tail: ["name"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "textarea",
									tail: ["is_disabled"]
								}]
							},
							required: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "textarea",
									tail: ["is_required"]
								}]
							},
							readonly: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "textarea",
									tail: ["is_readonly"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "textarea",
							name: "TEXTAREA_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}]
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "text_area",
			root_resource_name: "TEXTAREA_ELEMENT",
			attribute_mappings: {
				value: {
					type: "property",
					type_name: "String"
				}
			}
		},
		default_events: [],
		real_class: "input.TextArea",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	TextInput: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "TextInputElement",
						tag_name: "input",
						events: {
							change: [{
								locator_type: "Name",
								locator: "text_input",
								name: "value_changed"
							}],
							input: [{
								locator_type: "Name",
								locator: "text_input",
								name: "input"
							}],
							focus: [{
								locator_type: "Name",
								locator: "text_input",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "text_input",
								name: "_blurred"
							}],
							compatible_changed: [{
								locator_type: "Name",
								locator: "text_input",
								name: "value_changed"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "text_input",
									tail: ["name"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "text_input",
									tail: ["is_disabled"]
								}]
							},
							required: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "text_input",
									tail: ["is_required"]
								}]
							},
							readonly: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "text_input",
									tail: ["is_readonly"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "text_input",
							name: "TEXT_INPUT_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}],
					template: []
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "text_input",
			root_resource_name: "TEXT_INPUT_ELEMENT",
			attribute_mappings: {
				value: {
					type: "property",
					type_name: "String"
				}
			}
		},
		default_events: [],
		real_class: "input.Text",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	PasswordInput: {
		"extends": "TextInput",
		real_class: "input.Password",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Numeric: {
		"extends": "TextInput",
		real_class: "input.Numeric",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Radio: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "input",
						events: {
							change: [{
								locator_type: "Name",
								locator: "radio",
								name: "checked_changed"
							}],
							focus: [{
								locator_type: "Name",
								locator: "radio",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "radio",
								name: "_blurred"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "radio",
									tail: ["name"]
								}]
							},
							value: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "radio",
									tail: ["value"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "radio",
									tail: ["is_disabled"]
								}]
							},
							required: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "radio",
									tail: ["is_required"]
								}]
							},
							readonly: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "radio",
									tail: ["is_readonly"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "radio",
							name: "RADIO_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}]
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "radio",
			root_resource_name: "RADIO_ELEMENT",
			attribute_mappings: {
				checked: {
					type: "property",
					type_name: "SwitchAttribute",
					name: "is_checked"
				}
			}
		},
		default_events: [],
		real_class: "input.Radio",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	SubmitInput: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "input",
						events: {
							click: [{
								locator_type: "Name",
								locator: "submit",
								name: "clicked"
							}],
							focus: [{
								locator_type: "Name",
								locator: "submit",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "submit",
								name: "_blurred"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["name"]
								}]
							},
							value: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["value"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["is_disabled"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "submit",
							name: "SUBMIT_INPUT_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}]
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "submit_input",
			root_resource_name: "SUBMIT_INPUT_ELEMENT"
		},
		default_events: [],
		real_class: "input.Submit",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	SubmitButton: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "button",
						events: {
							click: [{
								locator_type: "Name",
								locator: "submit",
								name: "clicked"
							}],
							focus: [{
								locator_type: "Name",
								locator: "submit",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "submit",
								name: "_blurred"
							}]
						},
						property_bindings: {
							name: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["name"]
								}]
							},
							value: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["value"]
								}]
							},
							disabled: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "submit",
									tail: ["is_disabled"]
								}]
							}
						},
						resource_id: {
							locator_type: "Name",
							locator: "submit",
							name: "SUBMIT_BUTTON_ELEMENT"
						}
					},
					roles: [{name: "_input_view"}],
					template: [
						"\r\n\t\t\t\t",
						{
							name: "content",
							type: "include"
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			content: []
		},
		sugar: {
			tag_name: "submit_button",
			content_schema: {
				type: "include",
				name: "content"
			},
			root_resource_name: "SUBMIT_BUTTON_ELEMENT"
		},
		default_events: [],
		real_class: "input.Submit",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	SelectAbstract: {
		"extends": "InputAbstract",
		includes: {
			input_view: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "select",
						events: {
							change: [{
								locator_type: "Name",
								locator: "select",
								name: "value_changed"
							}],
							focus: [{
								locator_type: "Name",
								locator: "select",
								name: "_focused"
							}],
							blur: [{
								locator_type: "Name",
								locator: "select",
								name: "_blurred"
							}]
						}
					},
					roles: [{name: "_input_view"}],
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "select",
									tail: ["optgroups"]
								}]
							},
							as: "optgroup",
							template: [
								"\r\n\t\t\t\t",
								{
									type: "view",
									"class": "If",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "optgroup",
											tail: ["label"]
										}]
									},
									template: [
										"\r\n\t\t\t\t\t",
										{
											type: "view",
											"class": "View",
											container: {
												type: "Element",
												tag_name: "optgroup",
												property_bindings: {
													label: {
														evaluator: function() {
return (this._binds[0].getValue());
},
														flags: {isScopeEval: true},
														binds: [{
															property_name: "optgroup",
															tail: ["label"]
														}]
													},
													disabled: {
														evaluator: function() {
return (this._binds[0].getValue());
},
														flags: {isScopeEval: true},
														binds: [{
															property_name: "optgroup",
															tail: ["is_disabled"]
														}]
													}
												}
											},
											template: [
												"\r\n\t\t\t\t\t\t",
												{
													name: "group_options",
													type: "include"
												},
												"\r\n\t\t\t\t\t"
											]
										},
										"\r\n\t\t\t\t"
									],
									else_template: [
										"\r\n\t\t\t\t\t",
										{
											name: "group_options",
											type: "include"
										},
										"\r\n\t\t\t\t"
									]
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			group_options: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							property_name: "optgroup",
							tail: ["options"]
						}]
					},
					as: "option",
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "option",
									tail: ["title"]
								}]
							},
							container: {
								type: "Element",
								tag_name: "option",
								property_bindings: {
									value: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "option",
											tail: ["value"]
										}]
									},
									selected: {
										evaluator: function() {
return (this._callModifier("0", [this._binds[0].getValue()]));
},
										binds: [{
											property_name: "option",
											tail: ["value"]
										}],
										modifiers: [{
											locator_type: "Name",
											locator: "select",
											callback_name: "isValueSelected"
										}]
									},
									disabled: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "option",
											tail: ["is_disabled"]
										}]
									}
								}
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			]
		},
		default_events: [],
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Select: {
		"extends": "SelectAbstract",
		real_class: "input.Select",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	MultipleSelect: {
		"extends": "SelectAbstract",
		real_class: "input.MultipleSelect",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Collapsible: {
		template: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "View",
				container: {
					type: "Element",
					tag_name: "div",
					resource_id: {
						locator_type: "Name",
						locator: "collapsible",
						name: "COLLAPSIBLE_CONTAINER"
					}
				},
				roles: [{
					locator_type: "Name",
					locator: "collapsible",
					name: "_container_view"
				}],
				template: [
					"\r\n\t\t\t",
					{
						locator_type: "Name",
						locator: "collapsible",
						name: "content",
						type: "include"
					},
					"\r\n\t\t"
				]
			},
			"\r\n\t"
		],
		options: {
			animation: {"class": "Collapse"}
		},
		sugar: {
			tag_name: "collapsible",
			root_resource_name: "COLLAPSIBLE_CONTAINER",
			content_schema: {
				type: "include",
				name: "content"
			},
			attribute_mappings: {
				"is-expanded": {
					type: "property",
					type_name: "Boolean",
					name: "is_expanded"
				},
				"is-animation-enabled": {
					type: "property",
					type_name: "Boolean",
					name: "is_animation_enabled"
				}
			}
		},
		resources: {
			"default": {
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		},
		real_class: "Collapsible",
		"class": "Lava.widget.Collapsible",
		extender_type: "Standard",
		is_extended: true,
		resources_cache: {
			en: {
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		}
	},
	CollapsiblePanel: {
		type: "widget",
		"class": "Lava.widget.CollapsiblePanel",
		extender_type: "Standard",
		template: [
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "header_wrapper",
				type: "include"
			},
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "content_wrapper",
				type: "include"
			},
			"\r\n\t\t"
		],
		container: {
			type: "Element",
			tag_name: "div",
			resource_id: {
				locator_type: "Name",
				locator: "collapsible_panel",
				name: "COLLAPSIBLE_PANEL_CONTAINER"
			}
		},
		"extends": "Collapsible",
		includes: {
			header_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "div",
						events: {
							click: [{
								locator_type: "Name",
								locator: "collapsible_panel",
								name: "header_click"
							}]
						},
						resource_id: {
							locator_type: "Name",
							locator: "collapsible_panel",
							name: "COLLAPSIBLE_PANEL_HEADER_CONTAINER"
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							locator_type: "Name",
							locator: "collapsible_panel",
							name: "header",
							type: "include"
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			content_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "div"
					},
					roles: [{
						locator_type: "Name",
						locator: "collapsible_panel",
						name: "_container_view"
					}],
					template: [
						"\r\n\t\t\t",
						{
							type: "static_tag",
							resource_id: {
								locator_type: "Name",
								locator: "collapsible_panel",
								name: "COLLAPSIBLE_PANEL_BODY_CONTAINER"
							},
							name: "div",
							template: [
								"\r\n\t\t\t\t",
								{
									locator_type: "Name",
									locator: "collapsible_panel",
									name: "content",
									type: "include"
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			header: [
				"\r\n\t\t<h3 class=\"panel-title\">",
				{
					locator_type: "Name",
					locator: "collapsible_panel",
					name: "title",
					type: "include"
				},
				"</h3>\r\n\t"
			],
			title: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["title"]
						}]
					}
				},
				"\r\n\t"
			],
			content: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["content"]
						}]
					}
				},
				"\r\n\t"
			]
		},
		sugar: {
			tag_name: "collapsible-panel",
			root_resource_name: "COLLAPSIBLE_PANEL_CONTAINER",
			content_schema: {
				type: "union",
				tag_roles: {
					title: {type: "include"},
					content: {type: "include"}
				},
				name: "content"
			},
			attribute_mappings: {
				"is-locked": {
					type: "property",
					type_name: "Boolean",
					name: "is_locked"
				},
				"is-expanded": {
					type: "property",
					type_name: "Boolean",
					name: "is_expanded"
				},
				"is-animation-enabled": {
					type: "property",
					type_name: "Boolean",
					name: "is_animation_enabled"
				}
			}
		},
		resources: {
			"default": {
				COLLAPSIBLE_PANEL_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel",
							"lava-panel"
						]
					}]
				},
				COLLAPSIBLE_PANEL_HEADER_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel-heading",
							"lava-unselectable"
						]
					}]
				},
				COLLAPSIBLE_PANEL_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				}
			}
		},
		default_events: [],
		real_class: "CollapsiblePanel",
		is_extended: true,
		options: {
			animation: {"class": "Collapse"}
		},
		resources_cache: {
			en: {
				COLLAPSIBLE_PANEL_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel",
							"lava-panel"
						]
					}]
				},
				COLLAPSIBLE_PANEL_HEADER_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"panel-heading",
							"lava-unselectable"
						]
					}]
				},
				COLLAPSIBLE_PANEL_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				},
				COLLAPSIBLE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["lava-collapsible"]
					}]
				}
			}
		}
	},
	CollapsiblePanelExt: {
		"extends": "CollapsiblePanel",
		includes: {
			content_wrapper: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "If",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "collapsible_panel",
							tail: ["is_expanded"]
						}]
					},
					container: {
						type: "Emulated",
						options: {prepender: "AfterPrevious"}
					},
					roles: [{
						locator_type: "Name",
						locator: "collapsible_panel",
						name: "_content_if"
					}],
					refresher: {type: "Collapse"},
					template: [
						"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
						{
							type: "view",
							"class": "View",
							container: {
								type: "Element",
								tag_name: "div"
							},
							template: [
								"\r\n\t\t\t\t",
								{
									type: "static_tag",
									resource_id: {
										locator_type: "Name",
										locator: "collapsible_panel",
										name: "COLLAPSIBLE_PANEL_EXT_BODY_CONTAINER"
									},
									name: "div",
									template: [
										"\r\n\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "collapsible_panel",
											name: "content",
											type: "include"
										},
										"\r\n\t\t\t\t"
									]
								},
								"\r\n\t\t\t"
							]
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			]
		},
		sugar: {tag_name: "collapsible-panel-ext"},
		resources: {
			"default": {
				COLLAPSIBLE_PANEL_EXT_BODY_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-body"]
					}]
				}
			}
		},
		real_class: "CollapsiblePanelExt",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Accordion: {
		template: [
			"\r\n\t\t",
			{
				locator_type: "Name",
				locator: "accordion",
				name: "content",
				type: "include"
			},
			"\r\n\t"
		],
		includes: {
			content: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "accordion",
							tail: ["_panels"]
						}]
					},
					as: "panel",
					refresher: {type: "Standard"},
					template: [
						"\r\n\t\t\t\t\r\n\t\t\t\t",
						{
							type: "widget",
							"class": "Lava.WidgetConfigExtensionGateway",
							extender_type: "Standard",
							"extends": "CollapsiblePanel",
							assigns: {
								is_expanded: {
									evaluator: function() {
return (this._binds[0].getValue());
},
									flags: {isScopeEval: true},
									binds: [{
										property_name: "panel",
										tail: ["is_expanded"]
									}]
								}
							},
							includes: {
								title: [
									"\r\n\t\t\t\t\t\t",
									{
										type: "view",
										"class": "Include",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue());
},
											flags: {isScopeEval: true},
											binds: [{
												property_name: "panel",
												tail: ["title_template"]
											}]
										},
										template: []
									},
									"\r\n\t\t\t\t\t"
								],
								content: [
									"\r\n\t\t\t\t\t\t",
									{
										type: "view",
										"class": "Include",
										argument: {
											evaluator: function() {
return (this._binds[0].getValue());
},
											flags: {isScopeEval: true},
											binds: [{
												property_name: "panel",
												tail: ["content_template"]
											}]
										},
										template: []
									},
									"\r\n\t\t\t\t\t"
								]
							},
							roles: [{
								locator_type: "Name",
								locator: "accordion",
								name: "panel"
							}],
							resource_id: {
								locator_type: "Name",
								locator: "accordion",
								name: "panel"
							}
						},
						"\r\n\t\t\t"
					],
					container: {
						type: "Element",
						tag_name: "div",
						resource_id: {
							locator_type: "Name",
							locator: "accordion",
							name: "ACCORDION_CONTAINER"
						}
					}
				},
				"\r\n\t"
			]
		},
		storage_schema: {
			panels: {
				type: "object_collection",
				tag_name: "panel",
				properties: {
					title: {type: "template"},
					content: {type: "template"},
					is_expanded: {
						type: "lava_type",
						type_name: "Boolean",
						is_attribute: true
					}
				}
			}
		},
		sugar: {
			tag_name: "accordion",
			root_resource_name: "ACCORDION_CONTAINER",
			content_schema: {
				type: "storage_object",
				name: "panels"
			},
			attribute_mappings: {
				"keep-new-panels-expanded": {
					type: "switch",
					name: "keep_new_panels_expanded"
				}
			}
		},
		resources: {
			"default": {
				ACCORDION_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["panel-group"]
					}]
				},
				panel: {
					type: "component",
					value: {
						COLLAPSIBLE_PANEL_CONTAINER: {
							type: "container_stack",
							value: [{
								name: "add_classes",
								value: ["panel-collapse"]
							}]
						}
					}
				}
			}
		},
		real_class: "Accordion",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Tabs: {
		template: [
			"\r\n\t\t",
			{
				name: "tabs_header",
				type: "include"
			},
			"\r\n\t\t",
			{
				name: "tabs_body",
				type: "include"
			},
			"\r\n\t"
		],
		includes: {
			tabs_header: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "tabs",
							tail: ["_tabs"]
						}]
					},
					as: "tab",
					template: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "If",
							argument: {
								evaluator: function() {
return (! this._binds[0].getValue());
},
								binds: [{
									property_name: "tab",
									tail: ["is_hidden"]
								}]
							},
							template: [
								"\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										type: "Element",
										tag_name: "li",
										class_bindings: {
											"0": {
												evaluator: function() {
return (this._binds[0].getValue() ? 'active' : '');
},
												binds: [{
													property_name: "tab",
													tail: ["is_active"]
												}]
											},
											"1": {
												evaluator: function() {
return (this._binds[0].getValue() ? '' : 'disabled');
},
												binds: [{
													property_name: "tab",
													tail: ["is_enabled"]
												}]
											}
										}
									},
									template: [
										"\r\n\t\t\t\t\t\t",
										{
											type: "view",
											"class": "View",
											container: {
												type: "Element",
												tag_name: "a",
												events: {
													click: [{
														locator_type: "Name",
														locator: "tabs",
														name: "header_click",
														arguments: [{
															type: 2,
															data: {property_name: "tab"}
														}]
													}]
												},
												property_bindings: {
													href: {
														evaluator: function() {
return ('#' + (this._binds[0].getValue() || ''));
},
														binds: [{
															property_name: "tab",
															tail: ["name"]
														}]
													}
												}
											},
											template: [
												"\r\n\t\t\t\t\t\t\t",
												{
													type: "view",
													"class": "Include",
													argument: {
														evaluator: function() {
return (this._binds[0].getValue());
},
														flags: {isScopeEval: true},
														binds: [{
															property_name: "tab",
															tail: ["title_template"]
														}]
													},
													template: []
												},
												"\r\n\t\t\t\t\t\t"
											]
										},
										"\r\n\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t"
							]
						},
						"\r\n\t\t\t"
					],
					container: {
						type: "Element",
						tag_name: "ul",
						resource_id: {
							locator_type: "Name",
							locator: "tabs",
							name: "TABS_HEADERS_CONTAINER"
						}
					}
				},
				"\r\n\t"
			],
			tabs_body: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "tabs",
							tail: ["_tabs"]
						}]
					},
					as: "tab",
					refresher: {type: "Standard"},
					template: [
						"\r\n\t\t\t\t\r\n\t\t\t\t",
						{
							type: "view",
							"class": "View",
							container: {
								type: "Element",
								tag_name: "div",
								static_classes: ["tab-pane"],
								class_bindings: {
									"0": {
										evaluator: function() {
return (this._binds[0].getValue() ? 'active' : '');
},
										binds: [{
											property_name: "tab",
											tail: ["is_active"]
										}]
									}
								}
							},
							template: [
								"\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "Include",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "tab",
											tail: ["content_template"]
										}]
									},
									template: []
								},
								"\r\n\t\t\t\t"
							]
						},
						"\r\n\t\t\t"
					],
					container: {
						type: "Element",
						tag_name: "div",
						resource_id: {
							locator_type: "Name",
							locator: "tabs",
							name: "TABS_CONTENT_CONTAINER"
						}
					}
				},
				"\r\n\t"
			]
		},
		storage_schema: {
			tabs: {
				type: "object_collection",
				tag_name: "tab",
				properties: {
					title: {type: "template"},
					content: {type: "template"},
					name: {
						type: "lava_type",
						is_attribute: true,
						type_name: "String"
					},
					is_enabled: {
						type: "lava_type",
						is_attribute: true,
						type_name: "Boolean"
					},
					is_hidden: {
						type: "lava_type",
						is_attribute: true,
						type_name: "Boolean"
					},
					is_active: {
						type: "lava_type",
						is_attribute: true,
						type_name: "Boolean"
					}
				}
			}
		},
		sugar: {
			tag_name: "tabs",
			content_schema: {
				type: "storage_object",
				name: "tabs"
			}
		},
		resources: {
			"default": {
				TABS_HEADERS_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: [
							"nav",
							"nav-tabs"
						]
					}]
				},
				TABS_CONTENT_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "static_classes",
						value: ["tab-content"]
					}]
				}
			}
		},
		default_events: [],
		real_class: "Tabs",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Tooltip: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		template: [
			"\r\n\t\t\t",
			{
				type: "view",
				"class": "Expression",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tooltip",
						tail: ["html"]
					}]
				},
				escape_off: true,
				template: [],
				container: {
					type: "Element",
					tag_name: "div",
					static_classes: ["tooltip-inner"]
				}
			},
			"\r\n\t\t\t<div class=\"tooltip-arrow\"></div>\r\n\t\t"
		],
		container: {
			type: "Element",
			tag_name: "div",
			static_classes: ["tooltip"],
			style_bindings: {
				top: {
					evaluator: function() {
return ((this._binds[0].getValue() + this._binds[1].getValue()) + 'px');
},
					binds: [
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["y"]
						},
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["y_offset"]
						}
					]
				},
				left: {
					evaluator: function() {
return ((this._binds[0].getValue() + this._binds[1].getValue()) + 'px');
},
					binds: [
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["x"]
						},
						{
							locator_type: "Name",
							locator: "tooltip",
							tail: ["x_offset"]
						}
					]
				}
			},
			class_bindings: {
				"0": {
					evaluator: function() {
return (this._binds[0].getValue() ? 'in' : 'hidden');
},
					binds: [{
						locator_type: "Name",
						locator: "tooltip",
						tail: ["is_visible"]
					}]
				}
			}
		},
		real_class: "Tooltip",
		is_extended: false
	},
	DropDown: {
		options: {target_class: "open"},
		real_class: "DropDown",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Tree: {
		template: [
			"\r\n\t\t",
			{
				type: "view",
				"class": "Foreach",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue());
},
					flags: {isScopeEval: true},
					binds: [{
						locator_type: "Name",
						locator: "tree",
						tail: ["records"]
					}]
				},
				as: "node",
				roles: [{
					locator_type: "Name",
					locator: "tree",
					name: "root_nodes_foreach"
				}],
				template: [
					"\r\n\t\t\t\t\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "tree",
						name: "node",
						type: "include"
					},
					"\r\n\t\t\t"
				],
				container: {
					type: "Element",
					tag_name: "div",
					resource_id: {
						locator_type: "Name",
						locator: "tree",
						name: "MAIN_TREE_CONTAINER"
					}
				}
			},
			"\r\n\t"
		],
		assigns: {
			pad: {
				evaluator: function() {
return ('');
},
				flags: {
					isStatic: true,
					isString: true
				}
			},
			level: {
				evaluator: function() {
return (0);
},
				flags: {
					isStatic: true,
					isNumber: true
				}
			}
		},
		includes: {
			node: [
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "node_body",
					type: "include"
				},
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "node_children",
					type: "include"
				},
				"\r\n\t"
			],
			node_body: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "div",
						static_classes: ["lava-tree-node"],
						static_properties: {unselectable: "on"},
						class_bindings: {
							"0": {
								evaluator: function() {
return ('level-' + this._binds[0].getValue());
},
								binds: [{property_name: "level"}]
							}
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							locator_type: "Name",
							locator: "tree",
							name: "node_body_content",
							type: "include"
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			node_body_content: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{property_name: "pad"}]
					},
					escape_off: true,
					template: []
				},
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "i",
						static_classes: ["lava-tree-expander"],
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree",
								name: "node_click",
								arguments: [{
									type: 2,
									data: {property_name: "node"}
								}]
							}]
						},
						class_bindings: {
							"0": {
								evaluator: function() {
return ('lava-tree' + ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? '-bottom' : '-middle') + (this._binds[2].getValue() ? (this._binds[3].getValue() ? '-expanded' : '-collapsed') : '-node'));
},
								binds: [
									{property_name: "foreach_index"},
									{
										locator_type: "Label",
										locator: "parent",
										property_name: "count"
									},
									{
										locator_type: "Name",
										locator: "tree",
										isDynamic: true,
										property_name: "is_expandable"
									},
									{
										locator_type: "Name",
										locator: "tree",
										isDynamic: true,
										property_name: "is_expanded"
									}
								]
							}
						}
					}
				},
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "icon",
					type: "include"
				},
				"\r\n\t\t",
				{
					locator_type: "Name",
					locator: "tree",
					name: "node_title",
					type: "include"
				},
				"\r\n\t"
			],
			icon: [],
			node_children: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "If",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue() && this._binds[1].getValue());
},
						binds: [
							{
								locator_type: "Name",
								locator: "tree",
								isDynamic: true,
								property_name: "is_expandable"
							},
							{
								locator_type: "Name",
								locator: "tree",
								isDynamic: true,
								property_name: "is_expanded"
							}
						]
					},
					container: {
						type: "Emulated",
						options: {prepender: "AfterPrevious"}
					},
					roles: [{
						locator_type: "Name",
						locator: "tree",
						name: "node_children_view"
					}],
					assigns: {
						pad: {
							evaluator: function() {
return ((this._binds[0].getValue() == this._binds[1].getValue() - 1) ? this._binds[2].getValue() + '<div class="lava-tree-pad"></div>' : this._binds[3].getValue() + '<div class="lava-tree-pad-line"></div>');
},
							binds: [
								{property_name: "foreach_index"},
								{property_name: "count"},
								{property_name: "pad"},
								{property_name: "pad"}
							]
						},
						level: {
							evaluator: function() {
return (this._binds[0].getValue() + 1);
},
							binds: [{
								locator_type: "Label",
								locator: "parent",
								property_name: "level"
							}]
						}
					},
					template: [
						"\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t\r\n\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "node",
									tail: ["children"]
								}]
							},
							as: "node",
							roles: [{
								locator_type: "Name",
								locator: "tree",
								name: "nodes_foreach"
							}],
							template: [
								"\r\n\t\t\t\t\t\r\n\t\t\t\t\t",
								{
									locator_type: "Name",
									locator: "tree",
									name: "node",
									type: "include"
								},
								"\r\n\t\t\t\t"
							],
							container: {
								type: "Element",
								tag_name: "div",
								static_classes: ["lava-tree-container"]
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			node_title: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							property_name: "node",
							tail: ["title"]
						}]
					},
					container: {
						type: "Element",
						tag_name: "span",
						static_classes: ["lava-tree-title"],
						events: {
							click: [{
								locator_type: "Name",
								locator: "tree",
								name: "node_click",
								arguments: [{
									type: 2,
									data: {property_name: "node"}
								}]
							}]
						},
						class_bindings: {
							"0": {
								evaluator: function() {
return (this._binds[0].getValue() ? 'lava-tree-title-expandable' : '');
},
								binds: [{
									locator_type: "Name",
									locator: "tree",
									isDynamic: true,
									property_name: "is_expandable"
								}]
							}
						}
					}
				},
				"\r\n\t"
			]
		},
		resources: {
			"default": {
				MAIN_TREE_CONTAINER: {
					type: "container_stack",
					value: [{
						name: "add_classes",
						value: [
							"lava-tree",
							"lava-unselectable"
						]
					}]
				}
			}
		},
		default_events: [],
		real_class: "Tree",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		is_extended: false
	},
	Table: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		template: [
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "table",
				name: "thead",
				type: "include"
			},
			"\r\n\t\t\t",
			{
				locator_type: "Name",
				locator: "table",
				name: "tbody",
				type: "include"
			},
			"\r\n\t\t"
		],
		container: {
			type: "Element",
			tag_name: "table",
			resource_id: {
				locator_type: "Name",
				locator: "table",
				name: "TABLE_ELEMENT"
			}
		},
		includes: {
			thead: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "thead",
						resource_id: {
							locator_type: "Name",
							locator: "table",
							name: "THEAD_ELEMENT"
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "table",
									tail: ["_columns"]
								}]
							},
							as: "column",
							template: [
								"\r\n\t\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										type: "Element",
										tag_name: "td",
										events: {
											click: [{
												locator_type: "Name",
												locator: "table",
												name: "column_header_click",
												arguments: [{
													type: 2,
													data: {property_name: "column"}
												}]
											}]
										}
									},
									template: [
										"\r\n\t\t\t\t\t\t",
										{
											type: "view",
											"class": "Expression",
											argument: {
												evaluator: function() {
return (this._binds[0].getValue());
},
												flags: {isScopeEval: true},
												binds: [{
													property_name: "column",
													tail: ["title"]
												}]
											},
											container: {
												type: "Element",
												tag_name: "span",
												class_bindings: {
													"0": {
														evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? ('lava-column-sort-' + (this._binds[2].getValue() ? 'de' : 'a') + 'scending') : '');
},
														binds: [
															{
																property_name: "column",
																tail: ["name"]
															},
															{property_name: "_sort_column_name"},
															{
																locator_type: "Name",
																locator: "table",
																tail: ["_sort_descending"]
															}
														]
													}
												}
											}
										},
										"\r\n\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t"
							],
							container: {
								type: "Element",
								tag_name: "tr"
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			tbody: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "table",
							tail: ["records"]
						}]
					},
					as: "row",
					template: [
						"\r\n\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "table",
									tail: ["_columns"]
								}]
							},
							as: "column",
							template: [
								"\r\n\t\t\t\t\t\t",
								{
									type: "view",
									"class": "View",
									container: {
										type: "Element",
										tag_name: "td"
									},
									template: [
										"\r\n\t\t\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "table",
											name: "cell",
											arguments: [{
												type: 2,
												data: {property_name: "column"}
											}],
											type: "include"
										},
										"\r\n\t\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t\t"
							],
							container: {
								type: "Element",
								tag_name: "tr"
							}
						},
						"\r\n\t\t\t"
					],
					container: {
						type: "Element",
						tag_name: "tbody",
						resource_id: {
							locator_type: "Name",
							locator: "table",
							name: "TBODY_ELEMENT"
						}
					}
				},
				"\r\n\t"
			]
		},
		storage_schema: {
			cells: {
				type: "template_hash",
				tag_name: "cell"
			}
		},
		storage: {
			cells: {
				String: [
					"\r\n\t\t\t\t",
					{
						type: "view",
						"class": "Expression",
						argument: {
							evaluator: function() {
return (this._binds[0].getValue());
},
							flags: {isScopeEval: true},
							binds: [{
								property_name: "row",
								tail: [{
									property_name: "column",
									tail: ["name"]
								}]
							}]
						}
					},
					"\r\n\t\t\t"
				],
				Boolean: [
					"\r\n\t\t\t\t",
					{
						type: "view",
						"class": "Expression",
						argument: {
							evaluator: function() {
return (this._callGlobalModifier("translateBoolean", [!! this._binds[0].getValue()]));
},
							flags: {hasGlobalModifiers: true},
							binds: [{
								property_name: "row",
								tail: [{
									property_name: "column",
									tail: ["name"]
								}]
							}]
						}
					},
					"\r\n\t\t\t"
				]
			}
		},
		resources: {
			"default": {
				TABLE_ELEMENT: {
					type: "container_stack",
					value: [{
						name: "static_properties",
						value: {
							cellspacing: "0",
							cellpadding: "0"
						}
					}]
				}
			}
		},
		default_events: [],
		real_class: "Table",
		is_extended: false
	},
	Calendar: {
		type: "widget",
		"class": "Lava.WidgetConfigExtensionGateway",
		extender_type: "Standard",
		template: [
			"\r\n\t\t\t",
			{
				type: "view",
				"class": "If",
				argument: {
					evaluator: function() {
return (this._binds[0].getValue() == 'days');
},
					binds: [{
						locator_type: "Name",
						locator: "calendar",
						tail: ["_selected_view"]
					}]
				},
				template: [
					"\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "calendar",
						name: "days_view",
						type: "include"
					},
					"\r\n\t\t\t"
				],
				else_template: [
					"\r\n\t\t\t\t",
					{
						locator_type: "Name",
						locator: "calendar",
						name: "months_view",
						type: "include"
					},
					"\r\n\t\t\t"
				]
			},
			"\r\n\t\t"
		],
		container: {
			type: "Element",
			tag_name: "div",
			static_classes: ["lava-calendar"]
		},
		includes: {
			days_view: [
				"\r\n\t\t<div class=\"lava-calendar-header\">\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-left-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "previous_month_click"
							}]
						}
					},
					template: ["&#9664;"]
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_month_year_string"]
						}]
					},
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-days-view-month-name"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "days_view_month_name_click"
							}]
						}
					}
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-right-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "next_month_click"
							}]
						}
					},
					template: ["&#9654;"]
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-center\">\r\n\t\t\t",
				{
					locator_type: "Name",
					locator: "calendar",
					name: "months",
					type: "include"
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-footer\">\r\n\t\t\t",
				{
					type: "view",
					"class": "Expression",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_today_string"]
						}]
					},
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-today-link"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "today_click"
							}]
						}
					}
				},
				"\r\n\t\t</div>\r\n\t"
			],
			months_view: [
				"\r\n\t\t<div class=\"lava-calendar-header\">\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-left-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "previous_year_click"
							}]
						}
					},
					template: ["&#9664;"]
				},
				"\r\n\t\t\t",
				{
					"extends": "TextInput",
					assigns: {
						value: {
							evaluator: function() {
return (this._binds[0].getValue() + '');
},
							binds: [{
								locator_type: "Name",
								locator: "calendar",
								tail: ["_displayed_year"]
							}]
						}
					},
					roles: [{
						locator_type: "Name",
						locator: "calendar",
						name: "_year_input"
					}],
					"class": "Lava.WidgetConfigExtensionGateway",
					extender_type: "Standard",
					resource_id: {
						locator_type: "Name",
						locator: "calendar",
						name: "year_input"
					},
					type: "widget"
				},
				"\r\n\t\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "a",
						static_classes: ["lava-calendar-right-arrow"],
						static_properties: {href: "#"},
						events: {
							click: [{
								locator_type: "Name",
								locator: "calendar",
								name: "next_year_click"
							}]
						}
					},
					template: ["&#9654;"]
				},
				"\r\n\t\t</div>\r\n\t\t<div class=\"lava-calendar-center\">\r\n\t\t\t",
				{
					locator_type: "Name",
					locator: "calendar",
					name: "month_names",
					type: "include"
				},
				"\r\n\t\t</div>\r\n\t"
			],
			months: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_months_data"]
						}]
					},
					as: "month",
					template: [
						"\r\n\t\t\t<table class=\"lava-calendar-month\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<thead>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									locator_type: "Name",
									locator: "calendar",
									tail: ["_weekdays"]
								}]
							},
							as: "weekday",
							template: [
								"\r\n\t\t\t\t\t\t\t<td>",
								{
									type: "view",
									"class": "Expression",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "weekday",
											tail: ["title"]
										}]
									}
								},
								"</td>\r\n\t\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "month",
									tail: ["weeks"]
								}]
							},
							as: "week",
							template: [
								"\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t",
								{
									type: "view",
									"class": "Foreach",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{property_name: "week"}]
									},
									as: "day",
									template: [
										"\r\n\t\t\t\t\t\t\t\t",
										{
											locator_type: "Name",
											locator: "calendar",
											name: "day",
											type: "include"
										},
										"\r\n\t\t\t\t\t\t\t"
									]
								},
								"\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			day: [
				"\r\n\t\t",
				{
					type: "view",
					"class": "View",
					container: {
						type: "Element",
						tag_name: "td",
						events: {
							mousedown: [{
								locator_type: "Name",
								locator: "calendar",
								name: "day_click",
								arguments: [{
									type: 2,
									data: {property_name: "day"}
								}]
							}]
						},
						class_bindings: {
							"0": {
								evaluator: function() {
return (this._binds[0].getValue() ? 'lava-calendar-today' : '');
},
								binds: [{
									property_name: "day",
									tail: ["is_today"]
								}]
							},
							"1": {
								evaluator: function() {
return ((this._binds[0].getValue() != this._binds[1].getValue()) ? 'lava-calendar-other-month-day' : '');
},
								binds: [
									{
										property_name: "month",
										tail: ["index"]
									},
									{
										property_name: "day",
										tail: ["month"]
									}
								]
							},
							"2": {
								evaluator: function() {
return ((this._binds[0].getValue() >= this._binds[1].getValue() && this._binds[2].getValue() <= this._binds[3].getValue()) ? 'lava-calendar-selected-day' : '');
},
								binds: [
									{
										property_name: "day",
										tail: ["milliseconds"]
									},
									{
										locator_type: "Name",
										locator: "calendar",
										tail: ["_selection_start"]
									},
									{
										property_name: "day",
										tail: ["milliseconds"]
									},
									{
										locator_type: "Name",
										locator: "calendar",
										tail: ["_selection_end"]
									}
								]
							}
						}
					},
					template: [
						"\r\n\t\t\t",
						{
							type: "view",
							"class": "Expression",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{
									property_name: "day",
									tail: ["day"]
								}]
							}
						},
						"\r\n\t\t"
					]
				},
				"\r\n\t"
			],
			month_names: [
				"\r\n\t\t<table class=\"lava-calendar-month-names\">\r\n\t\t\t<tbody>\r\n\t\t\t\t",
				{
					type: "view",
					"class": "Foreach",
					argument: {
						evaluator: function() {
return (this._binds[0].getValue());
},
						flags: {isScopeEval: true},
						binds: [{
							locator_type: "Name",
							locator: "calendar",
							tail: ["_month_descriptor_rows"]
						}]
					},
					as: "row",
					template: [
						"\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t",
						{
							type: "view",
							"class": "Foreach",
							argument: {
								evaluator: function() {
return (this._binds[0].getValue());
},
								flags: {isScopeEval: true},
								binds: [{property_name: "row"}]
							},
							as: "descriptor",
							template: [
								"\r\n\t\t\t\t\t\t\t",
								{
									type: "view",
									"class": "Expression",
									argument: {
										evaluator: function() {
return (this._binds[0].getValue());
},
										flags: {isScopeEval: true},
										binds: [{
											property_name: "descriptor",
											tail: ["title"]
										}]
									},
									container: {
										type: "Element",
										tag_name: "td",
										events: {
											click: [{
												name: "month_click",
												arguments: [{
													type: 2,
													data: {property_name: "descriptor"}
												}]
											}]
										},
										class_bindings: {
											"0": {
												evaluator: function() {
return (this._binds[0].getValue() == this._binds[1].getValue() ? 'lava-calendar-month-selected' : (this._binds[2].getValue() == this._binds[3].getValue() ? 'lava-calendar-month-current' : ''));
},
												binds: [
													{
														locator_type: "Name",
														locator: "calendar",
														tail: ["_displayed_month"]
													},
													{
														property_name: "descriptor",
														tail: ["index"]
													},
													{
														locator_type: "Name",
														locator: "calendar",
														tail: ["_current_month"]
													},
													{
														property_name: "descriptor",
														tail: ["index"]
													}
												]
											}
										}
									}
								},
								"\r\n\t\t\t\t\t\t"
							]
						},
						"\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t"
					]
				},
				"\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t"
			]
		},
		resources: {
			"default": {
				year_input: {
					type: "component",
					value: {
						TEXT_INPUT_ELEMENT: {
							type: "container_stack",
							value: [
								{
									name: "add_properties",
									value: {maxlength: "5"}
								},
								{
									name: "add_classes",
									value: ["lava-calendar-year-input"]
								}
							]
						}
					}
				}
			}
		},
		options: {invalid_input_class: "lava-calendar-input-invalid"},
		default_events: [],
		real_class: "Calendar",
		is_extended: false
	}
};
Lava.sugar_map = {
	checkbox: {widget_title: "CheckBox"},
	text_area: {widget_title: "TextArea"},
	text_input: {widget_title: "TextInput"},
	radio: {widget_title: "Radio"},
	submit_input: {widget_title: "SubmitInput"},
	submit_button: {widget_title: "SubmitButton"},
	collapsible: {widget_title: "Collapsible"},
	"collapsible-panel": {widget_title: "CollapsiblePanel"},
	"collapsible-panel-ext": {widget_title: "CollapsiblePanelExt"},
	accordion: {widget_title: "Accordion"},
	tabs: {widget_title: "Tabs"}
};
