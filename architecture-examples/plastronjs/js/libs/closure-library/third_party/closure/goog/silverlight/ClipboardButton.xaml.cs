// Copyright 2010 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/// Clipboard button user control.
/// <author>nicksantos@google.com (Nick Santos)</author>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace ClosureLibrary {
  public enum ClipboardButtonType {
    COPY = 1,
    PASTE = 2
  }

  public partial class ClipboardButton : UserControl {
    private readonly ClipboardButtonType buttonType;
    private readonly string callbackName;

    /// <param name="buttonType">
    /// The clipboard event that the button will fire.
    /// </param>
    /// <param name="callbackName">
    /// The name of a callback into JS. If it's a Paste, it
    /// should be a function(string): void that accepts the clipboard contents.
    /// If it's a Copy, it should be a function(): string that returns
    /// the content to put on the clipboard.
    /// </param>
    /// <param name="buttonProperties">
    /// Other properties for the button, like Content.
    /// </param>
    public ClipboardButton(ClipboardButtonType buttonType, string callbackName,
        IDictionary<string, string> buttonProperties) {
      this.buttonType = buttonType;
      this.callbackName = callbackName;

      InitializeComponent();

      if (buttonProperties.Keys.Contains("Content")) {
        button.Content = buttonProperties["Content"];
      }
    }

    public void onClick(object sender, EventArgs e) {
      // TODO(nicksantos): What happens if the user denies clipboard access?
      if (buttonType == ClipboardButtonType.COPY) {
        Clipboard.SetText(HtmlPage.Window.Invoke(callbackName).ToString());
      } else {
        HtmlPage.Window.Invoke(callbackName, Clipboard.GetText());
      }
    }
  }
}
