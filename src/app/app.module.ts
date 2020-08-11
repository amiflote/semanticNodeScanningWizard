import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './visuals/graph/graph.component';
import { NodeVisualComponent } from './visuals/shared/node-visual/node-visual.component';
import { LinkVisualComponent } from './visuals/shared/link-visual/link-visual.component';
import { SHARED_VISUALS } from './visuals/shared';
import { D3_DIRECTIVES } from './d3/directives';
import { FormsModule } from '@angular/forms';
import { D3Service } from './d3/d3.service';
import { DbPediaService } from './data-api/dbpedia.service';
import { ChooseObjectDialogComponent } from './visuals/dialogs/choose-object-dialog/choose-object-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    LinkVisualComponent,
    NodeVisualComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    ChooseObjectDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [D3Service, DbPediaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
