import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstablishmentGalleryPage } from './establishment-gallery.page';

describe('EstablishmentGalleryPage', () => {
  let component: EstablishmentGalleryPage;
  let fixture: ComponentFixture<EstablishmentGalleryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentGalleryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstablishmentGalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
