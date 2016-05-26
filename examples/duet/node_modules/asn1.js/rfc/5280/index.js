try {
  var asn1 = require('asn1.js');
} catch (e) {
  var asn1 = require('../..');
}

/**
 * RFC5280 X509 and Extension Definitions
 */

var rfc5280 = exports;

// OIDs
var x509OIDs = {
  '2 5 29 9': 'subjectDirectoryAttributes',
  '2 5 29 14': 'subjectKeyIdentifier',
  '2 5 29 15': 'keyUsage',
  '2 5 29 17': 'subjectAlternativeName',
  '2 5 29 18': 'issuerAlternativeName',
  '2 5 29 19': 'basicConstraints',
  '2 5 29 20': 'cRLNumber',
  '2 5 29 21': 'reasonCode',
  '2 5 29 24': 'invalidityDate',
  '2 5 29 27': 'deltaCRLIndicator',
  '2 5 29 28': 'issuingDistributionPoint',
  '2 5 29 29': 'certificateIssuer',
  '2 5 29 30': 'nameConstraints',
  '2 5 29 31': 'cRLDistributionPoints',
  '2 5 29 32': 'certificatePolicies',
  '2 5 29 33': 'policyMappings',
  '2 5 29 35': 'authorityKeyIdentifier',
  '2 5 29 36': 'policyConstraints',
  '2 5 29 37': 'extendedKeyUsage',
  '2 5 29 46': 'freshestCRL',
  '2 5 29 54': 'inhibitAnyPolicy',
  '1 3 6 1 5 5 7 1 1': 'authorityInformationAccess',
  '1 3 6 1 5 5 7 11': 'subjectInformationAccess'
};

// CertificateList  ::=  SEQUENCE  {
//      tbsCertList          TBSCertList,
//      signatureAlgorithm   AlgorithmIdentifier,
//      signature            BIT STRING  }
var CertificateList = asn1.define('CertificateList', function() {
  this.seq().obj(
    this.key('tbsCertList').use(TBSCertList),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signature').bitstr()
  );
});
rfc5280.CerficateList = CertificateList;

// AlgorithmIdentifier  ::=  SEQUENCE  {
//      algorithm               OBJECT IDENTIFIER,
//      parameters              ANY DEFINED BY algorithm OPTIONAL  }
var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function() {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});
rfc5280.AlgorithmIdentifier = AlgorithmIdentifier;

// Certificate  ::=  SEQUENCE  {
//      tbsCertificate       TBSCertificate,
//      signatureAlgorithm   AlgorithmIdentifier,
//      signature            BIT STRING  }
var Certificate = asn1.define('Certificate', function() {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signature').bitstr()
  );
});
rfc5280.Certificate = Certificate;

// TBSCertificate  ::=  SEQUENCE  {
//      version         [0]  Version DEFAULT v1,
//      serialNumber         CertificateSerialNumber,
//      signature            AlgorithmIdentifier,
//      issuer               Name,
//      validity             Validity,
//      subject              Name,
//      subjectPublicKeyInfo SubjectPublicKeyInfo,
//      issuerUniqueID  [1]  IMPLICIT UniqueIdentifier OPTIONAL,
//      subjectUniqueID [2]  IMPLICIT UniqueIdentifier OPTIONAL,
//      extensions      [3]  Extensions OPTIONAL
var TBSCertificate = asn1.define('TBSCertificate', function() {
  this.seq().obj(
    this.key('version').def('v1').explicit(0).use(Version),
    this.key('serialNumber').int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),
    this.key('issuerUniqueID').optional().explicit(1).bitstr(),
    this.key('subjectUniqueID').optional().explicit(2).bitstr(),
    this.key('extensions').optional().explicit(3).seqof(Extension)
  );
});
rfc5280.TBSCertificate = TBSCertificate;

// Version  ::=  INTEGER  {  v1(0), v2(1), v3(2)  }
var Version = asn1.define('Version', function() {
  this.int({
    0: 'v1',
    1: 'v2',
    2: 'v3'
  });
});
rfc5280.Version = Version;

// Validity ::= SEQUENCE {
//      notBefore      Time,
//      notAfter       Time  }
var Validity = asn1.define('Validity', function() {
  this.seq().obj(
    this.key('notBefore').use(Time),
    this.key('notAfter').use(Time)
  );
});
rfc5280.Validity = Validity;

// Time ::= CHOICE {
//      utcTime        UTCTime,
//      generalTime    GeneralizedTime }
var Time = asn1.define('Time', function() {
  this.choice({
    utcTime: this.utctime(),
    genTime: this.gentime()
  });
});
rfc5280.Time = Time;

// SubjectPublicKeyInfo  ::=  SEQUENCE  {
//      algorithm            AlgorithmIdentifier,
//      subjectPublicKey     BIT STRING  }
var SubjectPublicKeyInfo = asn1.define('SubjectPublicKeyInfo', function() {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});
rfc5280.SubjectPublicKeyInfo = SubjectPublicKeyInfo;

// TBSCertList  ::=  SEQUENCE  {
//      version                 Version OPTIONAL,
//      signature               AlgorithmIdentifier,
//      issuer                  Name,
//      thisUpdate              Time,
//      nextUpdate              Time OPTIONAL,
//      revokedCertificates     SEQUENCE OF SEQUENCE  {
//           userCertificate         CertificateSerialNumber,
//           revocationDate          Time,
//           crlEntryExtensions      Extensions OPTIONAL
//      }  OPTIONAL,
//      crlExtensions           [0] Extensions OPTIONAL }
var TBSCertList = asn1.define('TBSCertList', function() {
  this.seq().obj(
    this.key('version').optional().int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('thisUpdate').use(Time),
    this.key('nextUpdate').use(Time),
    this.key('revokedCertificates').optional().seq().obj(
      this.seq().obj(
        this.key('userCertificate').int(),
        this.key('revocationDate').use(Time),
        this.key('crlEntryExtensions').optional().seqof(Extension)
      )
    ),
    this.key('crlExtensions').implicit(0).optional().seqof(Extension)
  );
});
rfc5280.TBSCertList = TBSCertList;

// Extension  ::=  SEQUENCE  {
//      extnID      OBJECT IDENTIFIER,
//      critical    BOOLEAN DEFAULT FALSE,
//      extnValue   OCTET STRING }
var Extension = asn1.define('Extension', function() {
  this.seq().obj(
    this.key('extnID').objid(x509OIDs),
    this.key('critical').bool().def(false),
    this.key('extnValue').octstr().contains(function(obj) {
      var out = x509Extensions[obj.extnID];
      // Cope with unknown extensions
      return out ? out : asn1.define('OctString', function() { this.any() })
    })
  );
});
rfc5280.Extension = Extension;

// Name ::= CHOICE { -- only one possibility for now --
//      rdnSequence  RDNSequence }
var Name = asn1.define('Name', function() {
  this.choice({
    rdnSequence: this.use(RDNSequence)
  });
});
rfc5280.Name = Name;

// GeneralName ::= CHOICE {
//      otherName                 [0]  AnotherName,
//      rfc822Name                [1]  IA5String,
//      dNSName                   [2]  IA5String,
//      x400Address               [3]  ORAddress,
//      directoryName             [4]  Name,
//      ediPartyName              [5]  EDIPartyName,
//      uniformResourceIdentifier [6]  IA5String,
//      iPAddress                 [7]  OCTET STRING,
//      registeredID              [8]  OBJECT IDENTIFIER }
var GeneralName = asn1.define('GeneralName', function() {
  this.choice({
    otherName: this.implicit(0).use(AnotherName),
    rfc822Name: this.implicit(1).ia5str(),
    dNSName: this.implicit(2).ia5str(),
    directoryName: this.explicit(4).use(Name),
    ediPartyName: this.implicit(5).use(EDIPartyName),
    uniformResourceIdentifier: this.implicit(6).ia5str(),
    iPAddress: this.implicit(7).octstr(),
    registeredID: this.implicit(8).objid()
  });
});
rfc5280.GeneralName = GeneralName;

// GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
var GeneralNames = asn1.define('GeneralNames', function() {
  this.seqof(GeneralName);
});
rfc5280.GeneralNames = GeneralNames;

// AnotherName ::= SEQUENCE {
//      type-id    OBJECT IDENTIFIER,
//      value      [0] EXPLICIT ANY DEFINED BY type-id }
var AnotherName = asn1.define('AnotherName', function() {
  this.seq().obj(
    this.key('type-id').objid(),
    this.key('value').explicit(0).any()
  );
});
rfc5280.AnotherName = AnotherName;

// EDIPartyName ::= SEQUENCE {
//      nameAssigner              [0]  DirectoryString OPTIONAL,
//      partyName                 [1]  DirectoryString }
var EDIPartyName = asn1.define('EDIPartyName', function() {
  this.seq().obj(
    this.key('nameAssigner').implicit(0).optional().use(DirectoryString),
    this.key('partyName').implicit(1).use(DirectoryString)
  );
});
rfc5280.EDIPartyName = EDIPartyName;

// RDNSequence ::= SEQUENCE OF RelativeDistinguishedName
var RDNSequence = asn1.define('RDNSequence', function() {
  this.seqof(RelativeDistinguishedName);
});
rfc5280.RDNSequence = RDNSequence;

// RelativeDistinguishedName ::=
//      SET SIZE (1..MAX) OF AttributeTypeAndValue
var RelativeDistinguishedName = asn1.define('RelativeDistinguishedName',
                                            function() {
  this.setof(AttributeTypeAndValue);
});
rfc5280.RelativeDistinguishedName = RelativeDistinguishedName;

// AttributeTypeAndValue ::= SEQUENCE {
//      type     AttributeType,
//      value    AttributeValue }
var AttributeTypeAndValue = asn1.define('AttributeTypeAndValue', function() {
  this.seq().obj(
    this.key('type').use(AttributeType),
    this.key('value').use(AttributeValue)
  );
});
rfc5280.AttributeTypeAndValue = AttributeTypeAndValue;

// Attribute               ::= SEQUENCE {
//       type             AttributeType,
//       values    SET OF AttributeValue }
var Attribute = asn1.define('Attribute', function() {
  this.seq().obj(
    this.key('type').use(AttributeType),
    this.key('values').setof(AttributeValue)
  );
});
rfc5280.Attribute = Attribute;

// AttributeType ::= OBJECT IDENTIFIER
var AttributeType = asn1.define('AttributeType', function() {
  this.objid();
});
rfc5280.AttributeType = AttributeType;

// AttributeValue ::= ANY -- DEFINED BY AttributeType
var AttributeValue = asn1.define('AttributeValue', function() {
  this.any();
});
rfc5280.AttributeValue = AttributeValue;

// DirectoryString ::= CHOICE {
//       teletexString           TeletexString (SIZE (1..MAX)),
//       printableString         PrintableString (SIZE (1..MAX)),
//       universalString         UniversalString (SIZE (1..MAX)),
//       utf8String              UTF8String (SIZE (1..MAX)),
//       bmpString               BMPString (SIZE (1..MAX)) }
var DirectoryString = asn1.define('DirectoryString', function() {
  this.choice({
    teletexString: this.t61str(),
    printableString: this.printstr(),
    universalString: this.unistr(),
    utf8String: this.utf8str(),
    bmpString: this.bmpstr()
  });
});
rfc5280.DirectoryString = DirectoryString;

// AuthorityKeyIdentifier ::= SEQUENCE {
//     keyIdentifier             [0] KeyIdentifier            OPTIONAL,
//     authorityCertIssuer       [1] GeneralNames             OPTIONAL,
//     authorityCertSerialNumber [2] CertificateSerialNumber  OPTIONAL }
var AuthorityKeyIdentifier = asn1.define('AuthorityKeyIdentifier', function() {
  this.seq().obj(
    this.key('keyIdentifier').optional().use(KeyIdentifier),
    this.key('authorityCertIssuer').optional().use(GeneralNames),
    this.key('authorityCertSerialNumber').optional()
    .use(CertificateSerialNumber)
  );
});
rfc5280.AuthorityKeyIdentifier = AuthorityKeyIdentifier;

// KeyIdentifier ::= OCTET STRING
var KeyIdentifier = asn1.define('KeyIdentifier', function() {
  this.octstr();
});
rfc5280.KeyIdentifier = KeyIdentifier;

// CertificateSerialNumber  ::=  INTEGER
var CertificateSerialNumber = asn1.define('CertificateSerialNumber',
                                          function() {
  this.int();
});
rfc5280.CertificateSerialNumber = CertificateSerialNumber;

// ORAddress ::= SEQUENCE {
//    built-in-standard-attributes BuiltInStandardAttributes,
//    built-in-domain-defined-attributes    BuiltInDomainDefinedAttributes
//                                            OPTIONAL,
//    extension-attributes ExtensionAttributes OPTIONAL }
var ORAddress = asn1.define('ORAddress', function() {
  this.seq().obj(
    this.key('builtInStandardAttributes').use(BuiltInStandardAttributes),
    this.key('builtInDomainDefinedAttributes').optional()
    .use(BuiltInDomainDefinedAttributes),
    this.key('extensionAttributes').optional().use(ExtensionAttributes)
  );
});
rfc5280.ORAddress = ORAddress;

// BuiltInStandardAttributes ::= SEQUENCE {
//    country-name                  CountryName OPTIONAL,
//    administration-domain-name    AdministrationDomainName OPTIONAL,
//    network-address           [0] IMPLICIT NetworkAddress OPTIONAL,
//    terminal-identifier       [1] IMPLICIT TerminalIdentifier OPTIONAL,
//    private-domain-name       [2] PrivateDomainName OPTIONAL,
//    organization-name         [3] IMPLICIT OrganizationName OPTIONAL,
//    numeric-user-identifier   [4] IMPLICIT NumericUserIdentifier OPTIONAL,
//    personal-name             [5] IMPLICIT PersonalName OPTIONAL,
//    organizational-unit-names [6] IMPLICIT OrganizationalUnitNames OPTIONAL }
var BuiltInStandardAttributes = asn1.define('BuiltInStandardAttributes',
                                            function() {
  this.seq().obj(
    this.key('countryName').optional().use(CountryName),
    this.key('administrationDomainName').optional()
    .use(AdministrationDomainName),
    this.key('networkAddress').optional().use(NetworkAddress),
    this.key('terminalIdentifier').optional().use(TerminalIdentifier),
    this.key('privateDomainName').optional().use(PrivateDomainName),
    this.key('organizationName').optional().use(OrganizationName),
    this.key('numericUserIdentifier').optional().use(NumericUserIdentifier),
    this.key('personalName').optional().use(PersonalName),
    this.key('organizationalUnitNames').optional().use(OrganizationalUnitNames)
  );
});
rfc5280.BuiltInStandardAttributes = BuiltInStandardAttributes;

// CountryName ::= CHOICE {
//    x121-dcc-code         NumericString,
//    iso-3166-alpha2-code  PrintableString }
var CountryName = asn1.define('CountryName', function() {
  this.choice({
    x121DccCode: this.numstr(),
    iso3166Alpha2Code: this.printstr()
  });
});
rfc5280.CountryName = CountryName;


// AdministrationDomainName ::= CHOICE {
//    numeric   NumericString,
//    printable PrintableString }
var AdministrationDomainName = asn1.define('AdministrationDomainName',
                                           function() {
  this.choice({
    numeric: this.numstr(),
    printable: this.printstr()
  });
});
rfc5280.AdministrationDomainName = AdministrationDomainName;

// NetworkAddress ::= X121Address
var NetworkAddress = asn1.define('NetworkAddress', function() {
  this.use(X121Address);
});
rfc5280.NetworkAddress = NetworkAddress;

// X121Address ::= NumericString
var X121Address = asn1.define('X121Address', function() {
  this.numstr();
});
rfc5280.X121Address = X121Address;

// TerminalIdentifier ::= PrintableString
var TerminalIdentifier = asn1.define('TerminalIdentifier', function() {
  this.printstr();
});
rfc5280.TerminalIdentifier = TerminalIdentifier;

// PrivateDomainName ::= CHOICE {
//    numeric   NumericString,
//    printable PrintableString }
var PrivateDomainName = asn1.define('PrivateDomainName', function() {
  this.choice({
    numeric: this.numstr(),
    printable: this.printstr()
  });
});
rfc5280.PrivateDomainName = PrivateDomainName;

// OrganizationName ::= PrintableString
var OrganizationName = asn1.define('OrganizationName', function() {
  this.printstr();
});
rfc5280.OrganizationName = OrganizationName;

// NumericUserIdentifier ::= NumericString
var NumericUserIdentifier = asn1.define('NumericUserIdentifier', function() {
  this.numstr();
});
rfc5280.NumericUserIdentifier = NumericUserIdentifier;

// PersonalName ::= SET {
//    surname     [0] IMPLICIT PrintableString,
//    given-name  [1] IMPLICIT PrintableString OPTIONAL,
//    initials    [2] IMPLICIT PrintableString OPTIONAL,
//    generation-qualifier [3] IMPLICIT PrintableString OPTIONAL }
var PersonalName = asn1.define('PersonalName', function() {
  this.set().obj(
    this.key('surname').implicit().printstr(),
    this.key('givenName').implicit().printstr(),
    this.key('initials').implicit().printstr(),
    this.key('generationQualifier').implicit().printstr()
  );
});
rfc5280.PersonalName = PersonalName;

// OrganizationalUnitNames ::= SEQUENCE SIZE (1..ub-organizational-units)
//                              OF OrganizationalUnitName
var OrganizationalUnitNames = asn1.define('OrganizationalUnitNames',
                                          function() {
  this.seqof(OrganizationalUnitName);
});
rfc5280.OrganizationalUnitNames = OrganizationalUnitNames;

// OrganizationalUnitName ::= PrintableString (SIZE
//                     (1..ub-organizational-unit-name-length))
var OrganizationalUnitName = asn1.define('OrganizationalUnitName', function() {
  this.printstr();
});
rfc5280.OrganizationalUnitName = OrganizationalUnitName;

// uiltInDomainDefinedAttributes ::= SEQUENCE SIZE
//                     (1..ub-domain-defined-attributes)
//                       OF BuiltInDomainDefinedAttribute
var BuiltInDomainDefinedAttributes = asn1.define(
  'BuiltInDomainDefinedAttributes', function() {
  this.seqof(BuiltInDomainDefinedAttribute);
});
rfc5280.BuiltInDomainDefinedAttributes = BuiltInDomainDefinedAttributes;

// BuiltInDomainDefinedAttribute ::= SEQUENCE {
//    type PrintableString (SIZE (1..ub-domain-defined-attribute-type-length)),
//    value PrintableString (SIZE (1..ub-domain-defined-attribute-value-length))
//}
var BuiltInDomainDefinedAttribute = asn1.define('BuiltInDomainDefinedAttribute',
                                                function() {
  this.seq().obj(
    this.key('type').printstr(),
    this.key('value').printstr()
  );
});
rfc5280.BuiltInDomainDefinedAttribute = BuiltInDomainDefinedAttribute;


// ExtensionAttributes ::= SET SIZE (1..ub-extension-attributes) OF
//                ExtensionAttribute
var ExtensionAttributes = asn1.define('ExtensionAttributes', function() {
  this.seqof(ExtensionAttribute);
});
rfc5280.ExtensionAttributes = ExtensionAttributes;

// ExtensionAttribute ::=  SEQUENCE {
//    extension-attribute-type [0] IMPLICIT INTEGER,
//    extension-attribute-value [1] ANY DEFINED BY extension-attribute-type }
var ExtensionAttribute = asn1.define('ExtensionAttribute', function() {
  this.seq().obj(
    this.key('extensionAttributeType').implicit().int(),
    this.key('extensionAttributeValue').any().implicit().int()
  );
});
rfc5280.ExtensionAttribute = ExtensionAttribute;

// SubjectKeyIdentifier ::= KeyIdentifier
var SubjectKeyIdentifier = asn1.define('SubjectKeyIdentifier', function() {
  this.use(KeyIdentifier);
});
rfc5280.SubjectKeyIdentifier = SubjectKeyIdentifier;

// KeyUsage ::= BIT STRING {
//      digitalSignature        (0),
//      nonRepudiation          (1),  -- recent editions of X.509 have
//                                    -- renamed this bit to contentCommitment
//      keyEncipherment         (2),
//      dataEncipherment        (3),
//      keyAgreement            (4),
//      keyCertSign             (5),
//      cRLSign                 (6),
//      encipherOnly            (7),
//      decipherOnly            (8) }
var KeyUsage = asn1.define('KeyUsage', function() {
  this.bitstr();
});
rfc5280.KeyUsage = KeyUsage;

// CertificatePolicies ::= SEQUENCE SIZE (1..MAX) OF PolicyInformation
var CertificatePolicies = asn1.define('CertificatePolicies', function() {
  this.seqof(PolicyInformation);
});
rfc5280.CertificatePolicies = CertificatePolicies;

// PolicyInformation ::= SEQUENCE {
//      policyIdentifier   CertPolicyId,
//      policyQualifiers   SEQUENCE SIZE (1..MAX) OF PolicyQualifierInfo
//                           OPTIONAL }
var PolicyInformation = asn1.define('PolicyInformation', function() {
  this.seq().obj(
    this.key('policyIdentifier').use(CertPolicyId),
    this.key('policyQualifiers').optional().use(PolicyQualifiers)
  );
});
rfc5280.PolicyInformation = PolicyInformation;

// CertPolicyId ::= OBJECT IDENTIFIER
var CertPolicyId = asn1.define('CertPolicyId', function() {
  this.objid();
});
rfc5280.CertPolicyId = CertPolicyId;

var PolicyQualifiers = asn1.define('PolicyQualifiers', function() {
  this.seqof(PolicyQualifierInfo);
});
rfc5280.PolicyQualifiers = PolicyQualifiers;

// PolicyQualifierInfo ::= SEQUENCE {
//      policyQualifierId  PolicyQualifierId,
//      qualifier          ANY DEFINED BY policyQualifierId }
var PolicyQualifierInfo = asn1.define('PolicyQualifierInfo', function() {
  this.seq().obj(
    this.key('policyQualifierId').use(PolicyQualifierId),
    this.key('qualifier').any().use(PolicyQualifierId)
  );
});
rfc5280.PolicyQualifierInfo = PolicyQualifierInfo;

// PolicyQualifierId ::= OBJECT IDENTIFIER
var PolicyQualifierId = asn1.define('PolicyQualifierId', function() {
  this.objid();
});
rfc5280.PolicyQualifierId = PolicyQualifierId;

// PolicyMappings ::= SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//      issuerDomainPolicy      CertPolicyId,
//      subjectDomainPolicy     CertPolicyId }
var PolicyMappings = asn1.define('PolicyMappings', function() {
  this.seqof(PolicyMapping);
});
rfc5280.PolicyMappings = PolicyMappings;

var PolicyMapping = asn1.define('PolicyMapping', function() {
  this.seq().obj(
    this.key('issuerDomainPolicy').use(CertPolicyId),
    this.key('subjectDomainPolicy').use(CertPolicyId)
  );
});
rfc5280.PolicyMapping = PolicyMapping;

// SubjectAltName ::= GeneralNames
var SubjectAlternativeName = asn1.define('SubjectAlternativeName', function() {
  this.use(GeneralNames);
});
rfc5280.SubjectAlternativeName = SubjectAlternativeName;

// IssuerAltName ::= GeneralNames
var IssuerAlternativeName = asn1.define('IssuerAlternativeName', function() {
  this.use(GeneralNames);
});
rfc5280.IssuerAlternativeName = IssuerAlternativeName;

// SubjectDirectoryAttributes ::= SEQUENCE SIZE (1..MAX) OF Attribute
var SubjectDirectoryAttributes = asn1.define('SubjectDirectoryAttributes',
                                             function() {
  this.seqof(Attribute);
});
rfc5280.SubjectDirectoryAttributes = SubjectDirectoryAttributes;

// BasicConstraints ::= SEQUENCE {
//         cA                      BOOLEAN DEFAULT FALSE,
//         pathLenConstraint       INTEGER (0..MAX) OPTIONAL }
var BasicConstraints = asn1.define('BasicConstraints', function() {
  this.seq().obj(
    this.key('cA').bool().def(false),
    this.key('pathLenConstraint').optional().int()
  );
});
rfc5280.BasicConstraints = BasicConstraints;

// NameConstraints ::= SEQUENCE {
//            permittedSubtrees       [0]     GeneralSubtrees OPTIONAL,
//            excludedSubtrees        [1]     GeneralSubtrees OPTIONAL }
var NameConstraints = asn1.define('NameConstraints', function() {
  this.seq().obj(
    this.key('permittedSubtrees').implicit(0).optional().use(GeneralSubtrees),
    this.key('excludedSubtrees').implicit(1).optional().use(GeneralSubtrees)
  );
});
rfc5280.NameConstraints = NameConstraints;

// GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree
var GeneralSubtrees = asn1.define('GeneralSubtrees', function() {
  this.seqof(GeneralSubtree);
});
rfc5280.GeneralSubtrees = GeneralSubtrees;

// GeneralSubtree ::= SEQUENCE {
//            base                    GeneralName,
//            minimum         [0]     BaseDistance DEFAULT 0,
//            maximum         [1]     BaseDistance OPTIONAL }
var GeneralSubtree = asn1.define('GeneralSubtree', function() {
  this.seq().obj(
    this.key('base').use(GeneralName),
    this.key('minimum').default(0).use(BaseDistance),
    this.key('maximum').optional().use(BaseDistance)
  );
});
rfc5280.GeneralSubtree = GeneralSubtree;

// BaseDistance ::= INTEGER
var BaseDistance = asn1.define('BaseDistance', function() {
  this.int();
});
rfc5280.BaseDistance = BaseDistance;

// PolicyConstraints ::= SEQUENCE {
//         requireExplicitPolicy           [0] SkipCerts OPTIONAL,
//         inhibitPolicyMapping            [1] SkipCerts OPTIONAL }
var PolicyConstraints = asn1.define('PolicyConstraints', function() {
  this.seq().obj(
    this.key('requireExplicitPolicy').implicit(0).optional().use(SkipCerts),
    this.key('inhibitPolicyMapping').implicit(1).optional().use(SkipCerts)
  );
});
rfc5280.PolicyConstraints = PolicyConstraints;

// SkipCerts ::= INTEGER
var SkipCerts = asn1.define('SkipCerts', function() {
  this.int();
});
rfc5280.SkipCerts = SkipCerts;

// ExtKeyUsageSyntax ::= SEQUENCE SIZE (1..MAX) OF KeyPurposeId
var ExtendedKeyUsage = asn1.define('ExtendedKeyUsage', function() {
  this.seqof(KeyPurposeId);
});
rfc5280.ExtendedKeyUsage = ExtendedKeyUsage;

// KeyPurposeId ::= OBJECT IDENTIFIER
var KeyPurposeId = asn1.define('KeyPurposeId', function() {
  this.objid();
});
rfc5280.KeyPurposeId = KeyPurposeId;

// RLDistributionPoints ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint
var CRLDistributionPoints = asn1.define('CRLDistributionPoints', function() {
  this.seqof(DistributionPoint);
});
rfc5280.CRLDistributionPoints = CRLDistributionPoints;

// DistributionPoint ::= SEQUENCE {
//         distributionPoint       [0]     DistributionPointName OPTIONAL,
//         reasons                 [1]     ReasonFlags OPTIONAL,
//         cRLIssuer               [2]     GeneralNames OPTIONAL }
var DistributionPoint = asn1.define('DistributionPoint', function() {
  this.seq().obj(
    this.key('distributionPoint').optional().use(DistributionPointName),
    this.key('reasons').optional().use(ReasonFlags),
    this.key('cRLIssuer').optional().use(GeneralNames)
  );
});
rfc5280.DistributionPoint = DistributionPoint;

// DistributionPointName ::= CHOICE {
//         fullName                [0]     GeneralNames,
//         nameRelativeToCRLIssuer [1]     RelativeDistinguishedName }
var DistributionPointName = asn1.define('DistributionPointName', function() {
  this.choice({
    fullName: this.implicit(0).use(GeneralNames),
    nameRelativeToCRLIssuer: this.implicit(1).use(RelativeDistinguishedName)
  });
});
rfc5280.DistributionPointName = DistributionPointName;

// ReasonFlags ::= BIT STRING {
//         unused                  (0),
//         keyCompromise           (1),
//         cACompromise            (2),
//         affiliationChanged      (3),
//         superseded              (4),
//         cessationOfOperation    (5),
//         certificateHold         (6),
//         privilegeWithdrawn      (7),
//         aACompromise            (8) }
var ReasonFlags = asn1.define('ReasonFlags', function() {
  this.bitstr();
});
rfc5280.ReasonFlags = ReasonFlags;

// InhibitAnyPolicy ::= SkipCerts
var InhibitAnyPolicy = asn1.define('InhibitAnyPolicy', function() {
  this.use(SkipCerts);
});
rfc5280.InhibitAnyPolicy = InhibitAnyPolicy;

// FreshestCRL ::= CRLDistributionPoints
var FreshestCRL = asn1.define('FreshestCRL', function() {
  this.use(CRLDistributionPoints);
});
rfc5280.FreshestCRL = FreshestCRL;

// AuthorityInfoAccessSyntax  ::=
//         SEQUENCE SIZE (1..MAX) OF AccessDescription
var AuthorityInfoAccessSyntax = asn1.define('AuthorityInfoAccessSyntax',
                                            function() {
  this.seqof(AccessDescription);
});
rfc5280.AuthorityInfoAccessSyntax = AuthorityInfoAccessSyntax;

// AccessDescription  ::=  SEQUENCE {
//         accessMethod          OBJECT IDENTIFIER,
//         accessLocation        GeneralName  }
var AccessDescription = asn1.define('AccessDescription', function() {
  this.seq().obj(
    this.key('accessMethod').objid(),
    this.key('accessLocation').use(GeneralName)
  );
});
rfc5280.AccessDescription = AccessDescription;

// SubjectInfoAccessSyntax  ::=
//            SEQUENCE SIZE (1..MAX) OF AccessDescription
var SubjectInformationAccess = asn1.define('SubjectInformationAccess',
                                           function() {
  this.seqof(AccessDescription);
});
rfc5280.SubjectInformationAccess = SubjectInformationAccess;

/**
 * CRL Extensions
 */

// CRLNumber ::= INTEGER
var CRLNumber = asn1.define('CRLNumber', function() {
  this.int();
});
rfc5280.CRLNumber = CRLNumber;

var DeltaCRLIndicator = asn1.define('DeltaCRLIndicator', function() {
  this.use(CRLNumber);
});
rfc5280.DeltaCRLIndicator = DeltaCRLIndicator;

// IssuingDistributionPoint ::= SEQUENCE {
//         distributionPoint          [0] DistributionPointName OPTIONAL,
//         onlyContainsUserCerts      [1] BOOLEAN DEFAULT FALSE,
//         onlyContainsCACerts        [2] BOOLEAN DEFAULT FALSE,
//         onlySomeReasons            [3] ReasonFlags OPTIONAL,
//         indirectCRL                [4] BOOLEAN DEFAULT FALSE,
//         onlyContainsAttributeCerts [5] BOOLEAN DEFAULT FALSE }
var IssuingDistributionPoint = asn1.define('IssuingDistributionPoint',
                                           function() {
  this.seq().obj(
    this.key('distributionPoint').use(DistributionPointName),
    this.key('onlyContainsUserCerts').def(false).bool(),
    this.key('onlyContainsCACerts').def(false).bool(),
    this.key('onlySomeReasons').use(ReasonFlags),
    this.key('indirectCRL').def(false).bool(),
    this.key('onlyContainsAttributeCerts').def(false).bool()
  );
});
rfc5280.IssuingDistributionPoint = IssuingDistributionPoint;

// CRLReason ::= ENUMERATED {
//         unspecified             (0),
//         keyCompromise           (1),
//         cACompromise            (2),
//         affiliationChanged      (3),
//         superseded              (4),
//         cessationOfOperation    (5),
//         certificateHold         (6),
//         -- value 7 is not used
//         removeFromCRL           (8),
//         privilegeWithdrawn      (9),
//         aACompromise           (10) }
var ReasonCode = asn1.define('ReasonCode', function() {
  this.enum();
});
rfc5280.ReasonCode = ReasonCode;

// InvalidityDate ::=  GeneralizedTime
var InvalidityDate = asn1.define('InvalidityDate', function() {
  this.gentime();
});
rfc5280.InvalidityDate = InvalidityDate;

// CertificateIssuer ::=     GeneralNames
var CertificateIssuer = asn1.define('CertificateIssuer', function() {
  this.use(GeneralNames);
});
rfc5280.CertificateIssuer = CertificateIssuer;

// OID label to extension model mapping
var x509Extensions = {
  subjectDirectoryAttributes: SubjectDirectoryAttributes,
  subjectKeyIdentifier: SubjectKeyIdentifier,
  keyUsage: KeyUsage,
  subjectAlternativeName: SubjectAlternativeName,
  issuerAlternativeName: IssuerAlternativeName,
  basicConstraints: BasicConstraints,
  cRLNumber: CRLNumber,
  reasonCode: ReasonCode,
  invalidityDate: InvalidityDate,
  deltaCRLIndicator: DeltaCRLIndicator,
  issuingDistributionPoint: IssuingDistributionPoint,
  certificateIssuer: CertificateIssuer,
  nameConstraints: NameConstraints,
  cRLDistributionPoints: CRLDistributionPoints,
  certificatePolicies: CertificatePolicies,
  policyMappings: PolicyMappings,
  authorityKeyIdentifier: AuthorityKeyIdentifier,
  policyConstraints: PolicyConstraints,
  extendedKeyUsage: ExtendedKeyUsage,
  freshestCRL: FreshestCRL,
  inhibitAnyPolicy: InhibitAnyPolicy,
  authorityInformationAccess: AuthorityInfoAccessSyntax,
  subjectInformationAccess: SubjectInformationAccess
};
